import React, { useState, useEffect } from 'react'
import { Heading } from '@chakra-ui/react'
import Layout from '../components/layout/Layout'
import Dropzone from 'react-dropzone'
import Resizer from "react-image-file-resizer";
//@ts-ignore
import browserImageSize from 'browser-image-size'
import {PhotoSample, Photo, GalleryIndex} from '../types/Types'
import { Buckets, PushPathResult, PrivateKey, WithKeyInfoOptions, KeyInfo } from '@textile/hub'
import {
  Button,
} from '@chakra-ui/react'

const keyInfo: KeyInfo = {
  key: 'bslg36pqnurdiujqywjblx2n2xa'
}

const keyInfoOptions: WithKeyInfoOptions = {
  debug: false
}
// const [photos, setPhotos] = useState([]);

function Sell(): JSX.Element {
  const [buckets, setBuckets] = useState(null);
  const [bucketKey, setbucketKey] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState(null);
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
  new Promise<any>((resolve) => {
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
    async function settingIdentity2() {
      const {buckets, bucketKey} = await getBucketKey();
      setBuckets(buckets)
      setbucketKey(bucketKey)
    }
    settingIdentity2();
  }, [identity])

  useEffect(() => {
    async function settingIdentity1() {
      await getBucketLinks();
    }
    settingIdentity1();
    const index = (async (): Promise<GalleryIndex> => {
      return await getPhotoIndex();
    })(); 
    
    if (index) {
      (async () => {
        await galleryFromIndex(await index);
        setIndex1(await index);
        setLoading(false)
      })(); 
    }
  }, [buckets, bucketKey])

  useEffect(() => {
    // Clear your user during development
    // await localStorage.clear()
    async function settingIdentity3() {
      const identity1 = await getIdentity();
      setIdentity(identity1);
    }
    settingIdentity3();
    // const identity1 = (async () => {
    //   setIdentity(await getIdentity());
    // })();

    // you might want to do the I18N setup here
  
    // this.setState({ 
    //   identity: identity
    // })
  
    // get their photo bucket
  
  
    // (async () => {
    //   await getBucketLinks();
    // })();
    
    
  }, []);

async function galleryFromIndex(index: GalleryIndex){
    if (!buckets || !bucketKey) {
      console.error('galleryFromIndex - No bucket client or root key')
      return
    }
    /* eslint-disable no-console */
    console.log('gacda')
    /* eslint-disable no-console */
    console.log(index)
    for (const path of index.paths) {
      const metadata = await buckets.pullPath(bucketKey, path)
      /* eslint-disable no-console */
      console.log(await buckets.links(bucketKey))
      /* eslint-disable no-console */
      console.log(links)
      const { value } = await metadata.next();
      let str = "";
      for (let i = 0; i < value.length; i++) {
        str += String.fromCharCode(parseInt(value[i]));
      }
      const json: Photo = JSON.parse(str)
      const photo = index.paths.length > 1 ? json.preview : json.original
      setPhotos([
        ...photos,
        {
          src:`${ipfsGateway}/ipfs/${photo.cid}`,
          width: photo.width,
          height: photo.height,
          key: photo.name,
        }
      ])
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
    /* eslint-disable no-console */
    console.log("initpublicgallery")
    /* eslint-disable no-console */
    console.log(buf);
    (async () => {
      await buckets.pushPath(bucketKey, 'index.html', buf)
    })()
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
    try{
      await buckets.pushPath(bucketKey, path, buf)
    } catch(e){
      /* eslint-disable no-console */
      console.log("exceptioni");
      /* eslint-disable no-console */
      console.log(e);
    }
  }

  async function onDrop(acceptedFiles: File[]) {
    if (photos.length > 50) {
      throw new Error('Gallery at maximum size')
    }
    if (acceptedFiles.length > 5) {
      throw new Error('Max 5 images at a time')
    }
    /* eslint-disable no-console */
    console.log(acceptedFiles)
    for (const accepted of acceptedFiles) {
      await handleNewFile(accepted)
    }
  }

  useEffect(() => {
    async function method(){
      storeIndex(index1)
  }
    method()
 }, [index1]);
  
  async function getBucketLinks(){
    if (!buckets || !bucketKey) {
      // console.error('getBucketLinks - No bucket client or root key')
      return
    }
    const links = await buckets.links(bucketKey)
    setLinks({
      ...links
    })
  }
  
  async function getBucketKey(){
    /* eslint-disable no-console */
    console.log("identity")
    /* eslint-disable no-console */
    console.log(identity)
    if (!identity) {
      throw new Error('Identity not set')
    }
    const buckets = await Buckets.withKeyInfo(keyInfo, keyInfoOptions)
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
    /* eslint-disable no-console */
    console.log(limits)
    /* eslint-disable no-console */
    console.log(resizeFile(image))
    const finalImage = image
    const size = await browserImageSize(finalImage)
    const location = `${path}${name}`
    const raw = await insertFile(finalImage, location)
    const metadata = {
      cid: raw.path.cid.toString(),
      name: name,
      path: location,
      ...size
    }
    /* eslint-disable no-console */
    console.log("metadata")
    /* eslint-disable no-console */
    console.log(metadata)
    return metadata
  }
  
  async function insertFile(file: File, path: string): Promise<PushPathResult> {
    if (!buckets || !bucketKey) {
      throw new Error('insertFile - No bucket client or root key')
    }
    const buckets1: Buckets = buckets
    /* eslint-disable no-console */
    console.log("bucketKey")
    /* eslint-disable no-console */
    console.log(bucketKey)
    /* eslint-disable no-console */
    console.log("path")
    /* eslint-disable no-console */
    console.log(path)
    /* eslint-disable no-console */
    console.log("file")
    /* eslint-disable no-console */
    console.log(file)
    
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
    console.log("file")
    /* eslint-disable no-console */
    console.log(file)
    /* eslint-disable no-console */
    console.log("filename")
    /* eslint-disable no-console */
    console.log(filename)
    /* eslint-disable no-console */
    imageSchema['original'] = await processAndStore(file, 'originals/', filename)
    
    imageSchema['preview'] = await processAndStore(file, 'previews/', filename, preview)
  
    imageSchema['thumb'] = await processAndStore(file, 'thumbs/', filename, thumb)
  
    const metadata = Buffer.from(JSON.stringify(imageSchema, null, 2))
    const metaname = `${now}_${file.name}.json`
    const path = `metadata/${metaname}`;
    
    (async () => {
      const raw = await buckets.pushPath(bucketKey, path, metadata);
    /* eslint-disable no-console */
    console.log("raw")
    /* eslint-disable no-console */
    console.log(raw.path.cid.toString())
    })()
  
    const photo = photos.length > 1 ? imageSchema['preview'] : imageSchema['original']
    setPhotos(photo)
    /* eslint-disable no-console */
    console.log(photos)
    setIndex1({
      ...index1,
      paths: [...index1.paths, path]
    })
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
