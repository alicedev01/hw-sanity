import EventSource from '@sanity/eventsource'
import {Observable} from 'rxjs'
import chalk from 'chalk'
import promptForDatasetName from '../../actions/dataset/datasetNamePrompt'
import validateDatasetName from '../../actions/dataset/validateDatasetName'
import listDatasetCopyJobs from '../../actions/dataset/listDatasetCopyJobs'
import debug from '../../debug'

const helpText = `
Options
  --detach Start the copy without waiting for it to finish
  --attach <job-id> Attach to the running copy process to show progress
  --skip-history Don't preserve document history on copy
  --list Lists all dataset copy jobs corresponding to a certain criteria.
  --offset Start position in the list of jobs. Default 0. With --list.
  --limit Maximum number of jobs returned. Default 10. Maximum 1000. With --list.

Examples
  sanity dataset copy
  sanity dataset copy <source-dataset>
  sanity dataset copy <source-dataset> <target-dataset>
  sanity dataset copy --skip-history <source-dataset> <target-dataset>
  sanity dataset copy --detach <source-dataset> <target-dataset>
  sanity dataset copy --attach <job-id>
  sanity dataset copy --list
  sanity dataset copy --list --offset=2
  sanity dataset copy --list --offset=2 --limit=10
`

const progress = (url) => {
  return new Observable((observer) => {
    let progressSource = new EventSource(url)
    let stopped = false

    function onError(error) {
      if (progressSource) {
        progressSource.close()
      }

      debug(`Error received: ${error}`)
      if (stopped) {
        return
      }
      observer.next({type: 'reconnect'})
      progressSource = new EventSource(url)
    }

    function onChannelError(error) {
      stopped = true
      progressSource.close()
      observer.error(error)
    }

    function onMessage(event) {
      const data = JSON.parse(event.data)
      if (data.state === 'failed') {
        debug('Job failed. Data: %o', event)
        observer.error(event)
      } else if (data.state === 'completed') {
        debug('Job succeeded. Data: %o', event)
        onComplete()
      } else {
        debug(`Job progressed. Data: %o`, event)
        observer.next(data)
      }
    }

    function onComplete() {
      progressSource.removeEventListener('error', onError)
      progressSource.removeEventListener('channel_error', onChannelError)
      progressSource.removeEventListener('job', onMessage)
      progressSource.removeEventListener('done', onComplete)
      progressSource.close()
      observer.complete()
    }

    progressSource.addEventListener('error', onError)
    progressSource.addEventListener('channel_error', onChannelError)
    progressSource.addEventListener('job', onMessage)
    progressSource.addEventListener('done', onComplete)
  })
}

const followProgress = (jobId, client, output) => {
  let currentProgress = 0

  const spinner = output.spinner({}).start()
  const listenUrl = client.getUrl(`jobs/${jobId}/listen`)

  debug(`Listening to ${listenUrl}`)

  progress(listenUrl).subscribe({
    next: (event) => {
      if (typeof event.progress === 'number') {
        currentProgress = event.progress
      }

      spinner.text = `Copy in progress: ${currentProgress}%`
    },
    error: (event) => {
      spinner.fail()
      throw new Error(`There was an error copying dataset: ${event.data}`)
    },
    complete: () => {
      spinner.succeed('Copy finished.')
    },
  })
}

export default {
  name: 'copy',
  group: 'dataset',
  signature: '[SOURCE_DATASET] [TARGET_DATASET]',
  helpText,
  description:
    'Manages dataset copying, including starting a new copy job, listing copy jobs and following the progress of a running copy job',
  action: async (args, context) => {
    const {apiClient, output, prompt} = context
    const flags = args.extOptions
    const client = apiClient()

    if (flags.list) {
      await listDatasetCopyJobs(flags, context)
      return
    }

    if (flags.attach) {
      const jobId = flags.attach

      if (!jobId) {
        throw new Error('Please supply a jobId')
      }

      followProgress(jobId, client, output)

      return
    }

    const [sourceDataset, targetDataset] = args.argsWithoutOptions
    const shouldSkipHistory = Boolean(flags['skip-history'])

    const nameError = sourceDataset && validateDatasetName(sourceDataset)
    if (nameError) {
      throw new Error(nameError)
    }

    const existingDatasets = await client.datasets
      .list()
      .then((datasets) => datasets.map((ds) => ds.name))

    const sourceDatasetName = await (sourceDataset ||
      promptForDatasetName(prompt, {message: 'Source dataset name:'}))
    if (!existingDatasets.includes(sourceDatasetName)) {
      throw new Error(`Source dataset "${sourceDatasetName}" doesn't exist`)
    }

    const targetDatasetName = await (targetDataset ||
      promptForDatasetName(prompt, {message: 'Target dataset name:'}))

    const err = validateDatasetName(targetDatasetName)
    if (err) {
      throw new Error(err)
    }

    try {
      const response = await client.request({
        method: 'PUT',
        uri: `/datasets/${sourceDatasetName}/copy`,
        body: {
          targetDataset: targetDatasetName,
          skipHistory: shouldSkipHistory,
        },
      })

      output.print(
        `Copying dataset ${chalk.green(sourceDatasetName)} to ${chalk.green(targetDatasetName)}...`
      )

      if (!shouldSkipHistory) {
        output.print(
          `Note: You can run this command with flag '--skip-history'. The flag will reduce copy time in larger datasets.`
        )
      }

      output.print(`Job ${chalk.green(response.jobId)} started`)

      if (flags.detach) {
        return
      }

      followProgress(response.jobId, client, output)
    } catch (error) {
      if (error.statusCode) {
        output.print(`${chalk.red(`Dataset copying failed:\n${error.response.body.message}`)}\n`)
      } else {
        output.print(`${chalk.red(`Dataset copying failed:\n${error.message}`)}\n`)
      }
    }
  },
}
