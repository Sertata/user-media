import { Button, Container, Paper, Stack, Typography } from '@mui/material'
import { FC, useRef, useEffect, useState } from 'react'

const hasGetUserMedia = () => {
  return !!(navigator?.mediaDevices?.getUserMedia);
}



export const App: FC = () => {
  const ref = useRef<HTMLVideoElement | null>(null)
  const [audio, setAudio] = useState<MediaStreamTrack | null>(null)

  const onMute = () => {
    if (!audio) return;

    audio.enabled = false
  }
  const onUnMute = () => {
    if (!audio) return;

    audio.enabled = true
  }
  console.log(audio?.enabled)
  useEffect(() => {
    if (hasGetUserMedia() && ref.current && ref.current instanceof HTMLVideoElement) {

      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(stream => {
          const audioTrack = stream.getAudioTracks()[0]
          setAudio(audioTrack)
          ref.current!.srcObject = stream
        })
        .catch(error => console.error(error))

    }
  }, [])

  return (
    <Container maxWidth='md'>
      <Stack justifyContent='center' alignItems='center'>
        <Typography color='text.secondary' variant='h1'>Трансляция</Typography>
      </Stack>
      <Paper elevation={12}>
        <Stack>
          <video ref={ref} autoPlay />
        </Stack>
      </Paper>
      <Stack justifyContent='center' alignItems='center'>
        <Button onClick={() => onMute()} variant='outlined'>Mute</Button>
        <Button onClick={() => onUnMute()} variant='outlined'>Unmute</Button>
      </Stack>
    </Container>
  )
}

