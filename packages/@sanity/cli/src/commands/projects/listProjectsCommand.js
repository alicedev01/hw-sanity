import {prefixCommand} from '../../util/isNpx'

const {size, sortBy} = require('lodash')

const commandPrefix = prefixCommand()

const headings = ['id', 'members', 'name', 'url', 'created']
const helpText = `
Options
  --sort <field> Sort output by specified column
  --order <asc/desc> Sort output ascending/descending

Examples
  # List projects
  ${commandPrefix} projects list

  # List projects sorted by member count, ascending
  ${commandPrefix} projects list --sort=members --order=asc
`

const defaultFlags = {
  sort: 'created',
  order: 'desc',
}

export default {
  name: 'list',
  group: 'projects',
  signature: '',
  helpText,
  description: 'Lists projects connected to your user',
  action: async (args, context) => {
    const {apiClient, output, chalk} = context
    const flags = {...defaultFlags, ...args.extOptions}
    const client = apiClient({
      requireUser: true,
      requireProject: false,
    })
    const projects = await client.request({
      method: 'GET',
      uri: '/projects',
    })

    const ordered = sortBy(
      projects.map(({displayName, id, members = [], studioHost = '', createdAt}) => {
        const studio = studioHost ? `https://${studioHost}.sanity.studio` : 'Not deployed'
        return [id, members.length, displayName, studio, createdAt]
      }),
      [headings.indexOf(flags.sort)]
    )

    const rows = flags.order === 'asc' ? ordered : ordered.reverse()

    const maxWidths = rows.reduce(
      (max, row) => row.map((current, index) => Math.max(size(current), max[index])),
      headings.map((str) => size(str))
    )

    const printRow = (row) => row.map((col, i) => `${col}`.padEnd(maxWidths[i])).join('   ')

    output.print(chalk.cyan(printRow(headings)))
    rows.forEach((row) => output.print(printRow(row)))
  },
}
