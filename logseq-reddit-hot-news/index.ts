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

const getOrCreatePage = async (pageName) => {
  logseq.App.pushState('page', { name: pageName });
  await delay(300);
  return logseq.Editor.getCurrentPage();
}

const createPages = async (pageNames: Array<string>) => {
  for (const pageName of pageNames) {
    console.log(await getOrCreatePage(pageName));
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

const createBlock = async (uuid, contents) => {
  return await logseq.Editor.insertBlock(uuid, contents);
}

const getBlock = async (uuid) => {
  return await logseq.Editor.getBlock(uuid);
}

const writeTweet = async (tweet, dateid) => {
  const page = await getOrCreatePage(tweet.authorName);
  const blockTree = await logseq.Editor.getCurrentPageBlocksTree();
  const tweetsBlock = blockTree.find((block) => block.content === "Tweets");
  let tweetsBlockUuid = null;
  if (!tweetsBlock) {
    const newTweetBlock = await createBlock(page.uuid, "Tweets");
    tweetsBlockUuid = newTweetBlock.uuid;
  } else {
    tweetsBlockUuid = tweetsBlock.uuid;
  }
  
  console.log({ tweetsBlockUuid });
  return page;
  // const tweetBlockId = getOrCreateBlock(pageId, "Tweets");
}

const getOrdinal = (date) => {
  if (date > 3 && date < 21) return "th";
  switch (date % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

const getDateId = () => {
  const today = new Date(Date.now());
  const dateString = today.toLocaleString("en-GB", 
    { year: "numeric", month: "long", day: "numeric" });
  const [day, month, year] = dateString.split(" ");
  const ordinal = getOrdinal(day);
  return `${month} ${day + ordinal}, ${year}`;
}

/**
 * main entry
 * @param baseInfo
 */
async function main(baseInfo: LSPluginBaseInfo) {
  const testPages = ['toosting1', 'toosting2', 'toosting3', 'toosting4', 'toosting5'];

  logseq.provideModel({
    getTweets: async () => {
      // const unsyncedTweets = await fetchUnsyncedTweets();
      const unsyncedTweets = [{
        attachmentUrls: [],
        authorId: "4889632813",
        authorIdConfirm: "4889632813",
        authorName: "Jeffrey Watumull",
        authorUsername: "jeffreywatumull",
        created_at: "2022-01-18T22:13:00.000Z",
        id: "1483563097893662721",
        syncDate: null,
        text: "@DavidDeutschOxf https://t.co/OHUmYNGRiW",
        url: "https://twitter.com/jeffreywatumull/status/1483563097893662721",
      },
      {
        attachmentUrls: ["https://pbs.twimg.com/media/FJehAzbXsAgH6Sg.jpg"
        ],
        authorId: "71026122",
        authorIdConfirm: "71026122",
        authorName: "McDonald's",
        authorUsername: "McDonalds",
        created_at: "2022-01-19T16:00:35.000Z",
        id: "1483831764695011331",
        source: "bookmarks",
        syncDate: null,
        text: "reply 🤏 to steal a fry https://t.co/qfhRsjAta3",
        url: "https://twitter.com/McDonalds/status/1483831764695011331",
      }
      ];
      // const testTweets = unsyncedTweets.unsyncedDocuments.slice(0, 2);
      console.log(getDateId());
      console.log(await writeTweet(unsyncedTweets[0], ""));
    }
  })

  logseq.App.registerUIItem('toolbar', {
    key: 'logseq-reddit',
    template: `
      <a style="display: inline-block; font-size: small" data-on-click="getTweets"
         class="button">
        <span>getTweets</span>
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
