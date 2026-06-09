import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'es.calculux.app',
  appName: 'CalcuLux',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
    }
  }
}

export default config