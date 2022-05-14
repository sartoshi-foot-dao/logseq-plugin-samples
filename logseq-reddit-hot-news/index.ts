import '@logseq/libs'
import { LSPluginBaseInfo } from '@logseq/libs/dist/libs'

const delay = (t = 100) => new Promise(r => setTimeout(r, t))

async function fetchUnsyncedTweets() {
  const endpoint = 'https://europe-west2-hypothesis-roam.cloudfunctions.net/unsyncedDocuments?collectionId=tweets'

  const data = await fetch(endpoint).then(res => res.json()).catch((err) => {
    console.log(err);
  });

  return data
}

async function fetchUnsyncedAnnotations() {
  const endpoint = 'https://europe-west2-hypothesis-roam.cloudfunctions.net/unsyncedDocuments?collectionId=annotations'

  const data = await fetch(endpoint).then(res => res.json()).catch((err) => {
    console.log(err);
  });

  return data
}

const createPage = async (pageName) => {
  logseq.App.pushState('page', { name: pageName });
  await delay(300);
  return logseq.Editor.getCurrentPage();
}

const createPages = async (pageNames: Array<string>) => {
  for (const pageName of pageNames) {
    console.log(await createPage(pageName));
  }
}

const getPage = async (name) => {
  return await logseq.Editor.getPage(name);
}

const deleteBlock = async (uuid) => {
  await logseq.Editor.removeBlock(uuid);
}

const deleteBlocks = async (pageNames: Array<string>) => {
  await Promise.all(pageNames.map(async (pageName) => {
    const { uuid } = await getPage(pageName)
    console.log(`deleting ${pageName} uuid: ${uuid}`);
    return deleteBlock(uuid);
  }))
}

// const createPage = async (name) => {
//   return await logseq.Editor.
// };
/**
 * main entry
 * @param baseInfo
 */
async function main(baseInfo: LSPluginBaseInfo) {
  const testPages = ['toosting1', 'toosting2', 'toosting3', 'toosting4', 'toosting5'];

  logseq.provideModel({
    async deleteTestPages() {
      await deleteBlocks(testPages);
    },
    async createTestPages() {


      // console.log(await fetchUnsyncedTweets());
      // console.log(await fetchUnsyncedAnnotations());

      // const info = await logseq.App.getUserConfigs()
      // if (loading) return

      // const pageName = 'reddit-logseq-hots-news'
      // const blockTitle = (new Date()).toLocaleString()

      

      const createdPages = await createPages(testPages);

      // await deleteBlocks(pages);

      // const page = await getPage('toosting3');
      // console.log({ page });
      // await deleteBlock(page.uuid);

      // for (const page of pages) {
      //   gotoOrCreatePage(page);
      //   await delay(300);
      // }
      // const toosting = await Promise.all(pages.map((page) => {
      //   return gotoOrCreatePage(page);
      // }));

      // console.log(toosting);

      




      // loading = true

      // try {
      //   const currentPage = await logseq.Editor.getCurrentPage()
      //   if (currentPage?.originalName !== pageName) throw new Error('page error')

      //   const pageBlocksTree = await logseq.Editor.getCurrentPageBlocksTree()
      //   let targetBlock = pageBlocksTree[0]!

      //   targetBlock = await logseq.Editor.insertBlock(targetBlock.uuid, '🚀 Fetching r/logseq ...', { before: true })

      // let blocks = await loadRedditData()

      //   blocks = blocks.map(it => ({ content: it }))

      //   await logseq.Editor.insertBatchBlock(targetBlock.uuid, blocks, {
      //     sibling: false
      //   })

      //   await logseq.Editor.updateBlock(targetBlock.uuid, `## 🔖 r/logseq - ${blockTitle}`)
      // } catch (e) {
      //   logseq.App.showMsg(e.toString(), 'warning')
      //   console.error(e)
      // } finally {
      //   loading = false
      // }
    }
  })

  logseq.App.registerUIItem('toolbar', {
    key: 'logseq-reddit',
    template: `
      <a style="display: inline-block" data-on-click="createTestPages"
         class="button">
        <span>create test pages</span>
      </a>
      <a style="display: inline-block" data-on-click="deleteTestPages"
         class="button">
        <span>delete test pages</span>
      </a>
    `
  })

  logseq.provideStyle(`
    [data-injected-ui=logseq-reddit-${baseInfo.id}] {
      display: flex;
      align-items: center;
    }
  `)
}

// bootstrap
logseq.ready(main).catch(console.error)
