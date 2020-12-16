import Table, {Cell, HorizontalTable} from "cli-table3";
import chalk from "chalk";
import issueKeyExtended, {AliasesPosition} from "../issueKeyExtended";
import {ReportLine} from "./worklogs";

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
    const projectTotals = await renderProjectTimes(timesPerProject, verbose, timesPerIssue);

    const table = new Table() as HorizontalTable
    table.push(
        totalHeaders,
        totals,
        projectHeaders,
        ...projectTotals.map((r) => r as Cell[])
    )
    return table
}

function convertToHours(time: number): string {
    return time / 3600 + 'h'
}

async function renderProjectTimes(timesPerProject: Array<ReportLine>, verbose: boolean, timesPerIssue: Array<ReportLine>) {
    const projectTotals = []
    for (let line of timesPerProject) {
        const tableContent = {
            id: {colSpan: 1, content: chalk.yellow('Project: ' + line.key), hAlign: 'left'},
            interval: {colSpan: 1, content: convertToHours(line.time), hAlign: 'right'}
        }
        projectTotals.push(Object.values(tableContent));
        if (verbose) {
            for (let issueLine of timesPerIssue.filter(entry => entry.key.startsWith(line.key))) {
                const issueKey = await issueKeyExtended(issueLine.key, AliasesPosition.Left);
                const issueContent = {
                    id: {colSpan: 1, content: chalk.yellow(issueKey  + ' '.repeat(10 - issueLine.key.length)), hAlign: 'right'},
                    interval: {colSpan: 1, content: convertToHours(issueLine.time), hAlign: 'right'}
                }
                projectTotals.push(Object.values(issueContent));
            }
        }
    }
    return projectTotals;
}
