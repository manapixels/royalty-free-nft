import React, { useState, useEffect } from 'react'
import { Heading } from '@chakra-ui/react'
import Layout from '../components/layout/Layout'
import Dropzone from 'react-dropzone'
import Resizer from "react-image-file-resizer";
import browserImageSize from 'browser-image-size'
import {PhotoSample, Photo, GalleryIndex} from '../types/Types'
import { Buckets, PushPathResult, PrivateKey, WithKeyInfoOptions, KeyInfo } from '@textile/hub'
import {
  Button,
} from '@chakra-ui/react'

const keyInfo: KeyInfo = {
  key: 'bslg36pqnurdiujqywjblx2n2xa',
  secret: 'bk3utwoapucrzyxmaugdbwygzurniokyvretfqui'
}

const keyInfoOptions: WithKeyInfoOptions = {
  debug: false
}
// const [photos, setPhotos] = useState([]);

function Sell(): JSX.Element {
  const [buckets, setBuckets] = useState(null);
  const [bucketKey, setbucketKey] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [photos, setPhotos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index1, setIndex1] = useState({
    author: '',
    date: 0,
    paths: []
  });
  const ipfsGateway = 'https://hub.textile.io';
  
const publicGallery = '<!doctype html><html lang=en><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><meta http-equiv=x-ua-compatible content="ie=edge"><meta property="twitter:description" content="built with textile.io. uses textile buckets and ipns to serve photo galleries over ipns"><title>Public Gallery</title><link rel=stylesheet href=https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css><script src=https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js></script><div class=wrapper><div class=grid></div></div><script>const loadIndex=async()=>{const elements=[]\n' +
'const index=await fetch("index.json")\n' +
'const json=await index.json()\n' +
'for(let path of json.paths){try{const meta=await fetchMetadata(path)\n' +
'elements.push({href:meta.path,type:"image"})}catch(err){console.log(err)}}\n' +
'const lightbox=GLightbox({selector:".grid",touchNavigation:true,closeButton:false,loop:true,elements:elements,});lightbox.open();}\n' +
'const fetchMetadata=async(path)=>{const index=await fetch(path)\n' +
'const json=await index.json()\n' +
'return json.original}\n' +
'window.addEventListener("DOMContentLoaded",function(){loadIndex()});</script>';
  const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });
  useEffect(() => {
    // Clear your user during development
    // await localStorage.clear()
    const identity = getIdentity();
    // const identity = (async () => {
    //   await getIdentity();
    // })();

    /* eslint-disable no-console */
    setIdentity(identity)
    // you might want to do the I18N setup here
  
    // this.setState({ 
    //   identity: identity
    // })
  
    // get their photo bucket
    async function getBucketThings() {
      const {buckets, bucketKey} = await getBucketKey();
      setBuckets(buckets)
      setbucketKey(bucketKey)
    }
    getBucketThings();
  
    (async () => {
      await getBucketLinks();
    })();
    
    const index = (async (): Promise<GalleryIndex> => {
      return await getPhotoIndex();
    })(); 
    if (index) {
      async () => {
        await galleryFromIndex(await index);
        setIndex1(await index);
        setLoading(false)
      }; 
    }
  });

async function galleryFromIndex(index: GalleryIndex){
    if (!buckets || !bucketKey) {
      console.error('galleryFromIndex - No bucket client or root key')
      return
    }
    for (const path of index.paths) {
      const metadata = await buckets.pullPath(bucketKey, path)
      /* eslint-disable no-console */
      console.log(await buckets.links(bucketKey))
      const { value } = await metadata.next();
      let str = "";
      for (let i = 0; i < value.length; i++) {
        str += String.fromCharCode(parseInt(value[i]));
      }
      const json: Photo = JSON.parse(str)
      const photo = index.paths.length > 1 ? json.preview : json.original
      this.setState({ 
        photos: [
          ...photos,
          {
            src:`${ipfsGateway}/ipfs/${photo.cid}`,
            width: photo.width,
            height: photo.height,
            key: photo.name,
          }
        ]
      })
    }
  }

async function getPhotoIndex(): Promise<GalleryIndex>{
    if (!buckets || !bucketKey) {
      // console.error('getPhotoIndex - No bucket client or root key')
      return
    }
    try {
      const metadata = buckets.pullPath(bucketKey, 'index.json')
      const { value } = await metadata.next();
      let str = "";
      for (let i = 0; i < value.length; i++) {
        str += String.fromCharCode(parseInt(value[i]));
      }
      const index: GalleryIndex = JSON.parse(str)
      return index
    } catch (error) {
      const index = await initIndex()
      await initPublicGallery()
      return index
    }
  }

  async function initPublicGallery() {
    if (!buckets || !bucketKey) {
      console.error('No bucket client or root key')
      return
    }
    const buf = Buffer.from(publicGallery)
    await buckets.pushPath(bucketKey, 'index.html', buf)
  }

  async function initIndex(){
    if (!identity) {
      console.error('Identity not set')
      return
    }
    const index = {
      author: identity.public.toString(),
      date: (new Date()).getTime(),
      paths: []
    }
    await storeIndex(index)
    return index
  }

  async function storeIndex(index: GalleryIndex) {
    if (!buckets || !bucketKey) {
      console.error('storeIndex - No bucket client or root key')
      return
    }
    const buf = Buffer.from(JSON.stringify(index, null, 2))
    const path = `index.json`
    await buckets.pushPath(bucketKey, path, buf)
  }

  async function onDrop(acceptedFiles: File[]) {
    if (photos.length > 50) {
      throw new Error('Gallery at maximum size')
    }
    if (acceptedFiles.length > 5) {
      throw new Error('Max 5 images at a time')
    }
    for (const accepted of acceptedFiles) {
      await handleNewFile(accepted)
    }
    storeIndex(index1)
  }
  
  async function getBucketLinks(){
    if (!buckets || !bucketKey) {
      // console.error('getBucketLinks - No bucket client or root key')
      return
    }
    const links = await buckets.links(bucketKey)
    this.setState({
      ...links
    })
  }
  
  async function getBucketKey(){
    if (!identity) {
      throw new Error('Identity not set')
    }
    const buckets = await Buckets.withKeyInfo(keyInfo, keyInfoOptions)
    /* eslint-disable no-console */
    console.log(buckets)
    // Authorize the user and your insecure keys with getToken
    await buckets.getToken(identity)
    
    const buck = await buckets.getOrCreate('io.textile.dropzone')
    if (!buck.root) {
      throw new Error('Failed to open bucket')
    }

    return {buckets: buckets, bucketKey: buck.root.key};
  }
  
  async function getIdentity(): Promise<PrivateKey> {
    try {
      const storedIdent = localStorage.getItem("identity")
      if (storedIdent === null) {
        throw new Error('No identity')
      }
      const restored = PrivateKey.fromString(storedIdent)
      return restored
    }
    catch (e) {
      /**
       * If any error, create a new identity.
       */
      try {
        const identity = PrivateKey.fromRandom()
        const identityString = identity.toString()
        localStorage.setItem("identity", identityString)
        return identity
      } catch (err) {
        return err.message
      }
    }
  }
  
  /**
     * processAndStore resamples the image and extracts the metadata. Next, it
     * calls insertFile to store each of the samples plus the metadata in the bucket.
     * @param image 
     * @param path 
     * @param name 
     * @param limits 
     */
   async function processAndStore(image: File, path: string, name: string, limits?: {maxWidth: number, maxHeight: number}): Promise<PhotoSample> {
    const finalImage = limits ? await resizeFile(image) : image
    const size = await browserImageSize(finalImage)
    const location = `${path}${name}`
    const raw = await insertFile(finalImage, location)
    const metadata = {
      cid: raw.path.cid.toString(),
      name: name,
      path: location,
      ...size
    }
    return metadata
  }
  
  async function insertFile(file: any, path: string): Promise<PushPathResult> {
    if (!buckets || !bucketKey) {
      throw new Error('insertFile - No bucket client or root key')
    }
    const buckets1: Buckets = buckets
    return await buckets1.pushPath(bucketKey, path, file.stream())
  }
  
  async function handleNewFile(file: File){
    const preview = {
      maxWidth: 800,
      maxHeight: 800
    }
    const thumb = {
      maxWidth: 200,
      maxHeight: 200
    }
    if (!buckets || !bucketKey) {
      console.error('handleNewFile - No bucket client or root key')
      return
    }
    const imageSchema: {[key: string]: any} = {}
    const now = new Date().getTime()
    imageSchema['date'] = now
    imageSchema['name'] = `${file.name}`
    const filename = `${now}_${file.name}`
    
    imageSchema['original'] = await processAndStore(file, 'originals/', filename)
    
    imageSchema['preview'] = await processAndStore(file, 'previews/', filename, preview)
  
    imageSchema['thumb'] = await processAndStore(file, 'thumbs/', filename, thumb)
  
    const metadata = Buffer.from(JSON.stringify(imageSchema, null, 2))
    const metaname = `${now}_${file.name}.json`
    const path = `metadata/${metaname}`;
    
    (async () => {
      await buckets.pushPath(bucketKey, path, metadata);
    })()
  
    const photo = photos.length > 1 ? imageSchema['preview'] : imageSchema['original']
    setPhotos(photo)
    // this.setState({ 
    //   index: {
    //     ...this.state.index,
    //     paths: [...this.state.index.paths, path]
    //   },
    //   photos: [
    //     ...this.state.photos,
    //     {
    //       src: `${this.ipfsGateway}/ipfs/${photo.cid}`,
    //       width: photo.width,
    //       height: photo.height,
    //       key: photo.name,
    //     }
    //   ]
    // })
  }
  
  function renderDropzone() : JSX.Element {
    return (
      <Dropzone 
        onDrop={onDrop}
        accept={'image/jpeg, image/png, image/gif'}
        maxSize={20000000}
        multiple={true}
        >
        {({getRootProps, getInputProps}) => (
          <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} />
            <Button
              className="icon"
              icon="images"
              title="add"
            />
            <span>DRAG & DROP</span>
          </div>
        )}
      </Dropzone>
    )
  }
  
  return (
    <Layout>
      <Heading as="h1" mb="12">
        {!loading && renderDropzone()}
      </Heading>
      Sell
    </Layout>
  )
}

export default Sell
