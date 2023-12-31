import { FC, useRef, useEffect, useState } from 'react'
import { Container, IconButton, Paper, Stack, SvgIcon, Typography } from '@mui/material'
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material/styles';
import { MdVoiceOverOff, MdRecordVoiceOver, MdVideocam, MdVideocamOff, MdCamera } from "react-icons/md";

const hasGetUserMedia = () => {
  return !!(navigator?.mediaDevices?.getUserMedia);
}
let theme = createTheme();
theme = responsiveFontSizes(theme);

export const App: FC = () => {
  const videoElRef = useRef<HTMLVideoElement | null>(null)
  const audioRef = useRef<MediaStreamTrack | null>(null)
  const videoRef = useRef<MediaStreamTrack | null>(null)

  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const [imageUrl, setImageUrl] = useState('')

  const takePhoto = () => {
    if (videoElRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = 700;
      canvas.height = 400;

      if (context && videoElRef) {
        context.drawImage(videoElRef.current, 0, 0, 700, 400);

        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.3);



        setImageUrl(imageDataUrl);
      }
    }

  };

  const onAudio = () => {
    if (!audioRef.current) return;

    if (audio) {
      audioRef.current.enabled = false
      setAudio(false)
      return
    }

    audioRef.current.enabled = true
    setAudio(true)
  }

  const onVideo = () => {
    if (!videoRef.current) return;

    if (video) {
      videoRef.current.enabled = false
      setVideo(false)
      return
    }

    videoRef.current.enabled = true
    setVideo(true)
  }


  useEffect(() => {
    if (hasGetUserMedia() && videoElRef.current && videoElRef.current instanceof HTMLVideoElement) {

      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(stream => {
          audioRef.current = stream.getAudioTracks()[0]
          videoRef.current = stream.getVideoTracks()[0]
          videoElRef.current!.srcObject = stream
        })
        .catch(error => console.error(error))

    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth='md'>
        <Stack justifyContent='center' alignItems='center'>
          <Typography color='text.secondary' variant='h3'>Трансляция</Typography>
        </Stack>
        <Paper elevation={12}>
          <Stack sx={{ position: 'relative' }}>
            <video ref={videoElRef} autoPlay />
            <Stack sx={{ position: 'absolute', left: 0, right: 0, margin: 'auto', bottom: '8px' }} justifyContent='center' alignItems='center' direction='row' spacing={2} >
              <IconButton onClick={() => onAudio()}>
                {audio
                  ? <SvgIcon color='success'><MdRecordVoiceOver /></SvgIcon>
                  : <SvgIcon color='success'><MdVoiceOverOff /></SvgIcon>}
              </IconButton>
              <IconButton onClick={() => onVideo()}>
                {video
                  ? <SvgIcon color='success'><MdVideocam /></SvgIcon>
                  : <SvgIcon color='success'><MdVideocamOff /></SvgIcon>}
              </IconButton>
              <IconButton onClick={takePhoto}><SvgIcon><MdCamera /></SvgIcon></IconButton>
            </Stack>
          </Stack>
          {imageUrl && <img src={imageUrl} />}
        </Paper>
      </Container>
    </ThemeProvider>
  )
}

