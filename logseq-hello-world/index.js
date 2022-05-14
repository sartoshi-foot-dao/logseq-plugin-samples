/**
 * entry
 */



function main() {
  const endpoint = 'https://europe-west2-hypothesis-roam.cloudfunctions.net/unsyncedDocuments?collectionId=tweets'

  const data = fetch(endpoint).then(res => res.json()).catch((err) => {
    console.log(err);
  });
  console.log(data);


  logseq.App.showMsg('❤️ Message from Hello World Plugin :)');
  logseq.App.showMsg(data);
}

// bootstrap
logseq.ready(main).catch(console.error)
