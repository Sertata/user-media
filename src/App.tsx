import { Button, Container, Paper, Stack, Typography } from '@mui/material'
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material/styles';
import { FC, useRef, useEffect } from 'react'

const hasGetUserMedia = () => {
  return !!(navigator?.mediaDevices?.getUserMedia);
}
let theme = createTheme();
theme = responsiveFontSizes(theme);

export const App: FC = () => {
  const videoElRef = useRef<HTMLVideoElement | null>(null)
  const audioRef = useRef<MediaStreamTrack | null>(null)

  const onMute = () => {
    if (!audioRef.current) return;

    audioRef.current.enabled = false
  }
  const onUnMute = () => {
    if (!audioRef.current) return;

    audioRef.current.enabled = true
  }
  useEffect(() => {
    if (hasGetUserMedia() && videoElRef.current && videoElRef.current instanceof HTMLVideoElement) {

      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(stream => {
          audioRef.current = stream.getAudioTracks()[0]
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
          <Stack>
            <video ref={videoElRef} autoPlay />
          </Stack>
        </Paper>
        <Stack justifyContent='center' alignItems='center' direction='row' spacing={2} sx={{ padding: '8px' }}>
          <Button onClick={() => onMute()} variant='contained'>Mute</Button>
          <Button onClick={() => onUnMute()} variant='contained'>Unmute</Button>
        </Stack>
      </Container>
    </ThemeProvider>
  )
}

