import { useEffect } from 'react'
import { Font } from '@react-pdf/renderer'

// Import your font files
import RobotoRegular from '../../assets/font/Roboto/Roboto-Regular.ttf'
import RobotoBold from '../../assets/font/Roboto/Roboto-Bold.ttf'
import RobotoItalic from '../../assets/font/Roboto/Roboto-Italic.ttf'

import FiraSansRegular from '../../assets/font/FiraSans/FiraSans-Regular.ttf'
import FiraSansBold from '../../assets/font/FiraSans/FiraSans-Bold.ttf'
import FiraSansItalic from '../../assets/font/FiraSans/FiraSans-Italic.ttf'

import RobotMonoRegular from '../../assets/font/RobotMono/RobotoMono-Regular.ttf'
import RobotMonoBold from '../../assets/font/RobotMono/RobotoMono-Bold.ttf'
import RobotMonoItalic from '../../assets/font/RobotMono/RobotoMono-Italic.ttf'
// ../../assets/font/RobotMono/RobotMono-Italic.ttf
export default function FontRegistration() {
    useEffect(() => {
      // Register fonts with explicit weight values
      Font.register({
        family: 'Roboto',
        fonts: [
          { src: RobotoRegular, fontWeight: 400, fontStyle: 'normal' },
          { src: RobotoBold, fontWeight: 700, fontStyle: 'bold' },
          { src: RobotoItalic, fontWeight: 400, fontStyle: 'italic' },
        ],
      })
  
      Font.register({
        family: 'FiraSans',
        fonts: [
          { src: FiraSansRegular, fontWeight: 400, fontStyle: 'normal' },
          { src: FiraSansBold, fontWeight: 700, fontStyle: 'bold' },
          { src: FiraSansItalic, fontWeight: 400, fontStyle: 'italic' },
        ],
      })
  
      Font.register({
        family: 'RobotoMono',
        fonts: [
          { src: RobotMonoRegular, fontWeight: 400, fontStyle: 'normal' },
          { src: RobotMonoBold, fontWeight: 700, fontStyle: 'bold' },
          { src: RobotMonoItalic, fontWeight: 400, fontStyle: 'italic' },
        ],
      })
    }, [])
  
    return null
  }