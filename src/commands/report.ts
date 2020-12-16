import {Command, flags} from "@oclif/command";
import {appName} from "../appName";
import globalFlags from '../globalFlags'
import tempo from "../tempo";

export default class Report extends Command {
    static description = '[or rep], print a report about the users logged times'

    static examples = [
        `${appName} report`,
        `${appName} rep -v`,
        `${appName} rep --project=PRJ`,
        `${appName} rep -p PRJ`,
        `${appName} rep --start=2020-01-01`,
        `${appName} rep --start=2020-01-01 --end=2020-01-31`,
        `${appName} rep -s 2020-01-01`,
        `${appName} rep -v -p TST -s 2020-01-01 -e 2020-12-31`,
    ]

    static aliases = ['rep']

    static flags = {
        help: flags.help({char: 'h'}),
        debug: flags.boolean(),
        verbose: flags.boolean({
            char: 'v',
            description: 'verbose output with logged time per issue'
        }),
        start: flags.string({
            char: 's',
            description: 'start date (yyyy-MM-dd format) defaulted to first recorded worklog'
        }),
        end: flags.string({
            char: 'e',
            description: 'end date (yyyy-MM-dd format) defaulted to today'
        }),
        project: flags.string({
            char: 'p',
            description: 'project key to which the report should be limited, eg KEY includes KEY-1 but not KEZ-1'
        })
    }

    async run() {
        const {args, flags} = this.parse(Report)
        globalFlags.debug = flags.debug
        await tempo.totalLoggedTime(flags.verbose, flags.start, flags.end, flags.project)
    }
}