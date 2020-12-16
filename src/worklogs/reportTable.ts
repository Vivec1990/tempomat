import Table, {Cell, HorizontalTable} from "cli-table3";
import chalk from "chalk";
import issueKeyExtended, {AliasesPosition} from "../issueKeyExtended";
import {ReportLine} from "./worklogs";

function convertToHours(time: number): string {
    return time / 3600 + 'h'
}

export async function render(reportStartDate: string, reportEndDate: string, totalTime: number, totalRequired: number, timesPerIssue: Array<ReportLine>, timesPerProject: Array<ReportLine>, verbose = false) {
    const totalHeaders = [
        {content: chalk.bold.greenBright('report timespan'), hAlign: 'left'},
        {content: chalk.bold.greenBright('total logged hours'), hAlign: 'right'},
    ].map((r => r as Cell));
    const totals = Object.values({
        id: {colSpan: 1, content: chalk.yellow(reportStartDate + ' to ' + reportEndDate), hAlign: 'right'},
        interval: {
            colSpan: 1,
            content: convertToHours(totalTime) + '/' + convertToHours(totalRequired),
            hAlign: 'right'
        }
    }).map((r) => r as Cell)
    const projectHeaders = [
        {content: chalk.bold.greenBright('projects'), hAlign: 'left'},
        {content: chalk.bold.greenBright('logged hours'), hAlign: 'right'},
    ].map((r => r as Cell));
    const projectTotals = []
    for (let line of timesPerProject) {
        const tableContent = {
            id: {colSpan: 1, content: chalk.yellow('Project: ' + line.key), hAlign: 'left'},
            interval: {colSpan: 1, content: convertToHours(line.time), hAlign: 'right'}
        }
        projectTotals.push(Object.values(tableContent));
        if (verbose) {
            timesPerIssue.filter(entry => entry.key.startsWith(line.key)).forEach(issueLine => {
                const issueContent = {
                    id: {colSpan: 1, content: chalk.yellow(issueLine.key), hAlign: 'right'},
                    interval: {colSpan: 1, content: convertToHours(issueLine.time), hAlign: 'right'}
                }
                projectTotals.push(Object.values(issueContent));
            })
        }
    }
    const content = [];
    for (let line of timesPerIssue) {
        const issueKey = await issueKeyExtended(line.key, AliasesPosition.Left)
        const tableContent = {
            id: {colSpan: 1, content: chalk.yellow(issueKey), hAlign: 'right'},
            interval: {colSpan: 1, content: convertToHours(line.time), hAlign: 'right'}
        }
        content.push(Object.values(tableContent));
    }

    const table = new Table() as HorizontalTable
    table.push(
        totalHeaders,
        totals,
        projectHeaders,
        ...projectTotals.map((r) => r as Cell[])
    )
    return table
}