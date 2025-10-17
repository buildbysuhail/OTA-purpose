import { useEffect } from 'react'
import { Font } from '@react-pdf/renderer'

// Import your font files
import RobotoLight from '../../assets/font/Roboto/Roboto-Light.ttf'
import RobotoRegular from '../../assets/font/Roboto/Roboto-Regular.ttf'
import RobotoMedium from '../../assets/font/Roboto/Roboto-Medium.ttf'
import RobotoBold from '../../assets/font/Roboto/Roboto-Bold.ttf'
import RobotoLightItalic from '../../assets/font/Roboto/Roboto-LightItalic.ttf'
import RobotoItalic from '../../assets/font/Roboto/Roboto-Italic.ttf'
import RobotoMediumItalic from '../../assets/font/Roboto/Roboto-MediumItalic.ttf'
import RobotoBoldItalic from '../../assets/font/Roboto/Roboto-BoldItalic.ttf'

import FiraSansLight from '../../assets/font/FiraSans/FiraSans-Light.ttf'
import FiraSansRegular from '../../assets/font/FiraSans/FiraSans-Regular.ttf'
import FiraSansMedium from '../../assets/font/FiraSans/FiraSans-Medium.ttf'
import FiraSansSemiBold from '../../assets/font/FiraSans/FiraSans-SemiBold.ttf'
import FiraSansBold from '../../assets/font/FiraSans/FiraSans-Bold.ttf'
import FiraSansLightItalic from '../../assets/font/FiraSans/FiraSans-LightItalic.ttf'
import FiraSansItalic from '../../assets/font/FiraSans/FiraSans-Italic.ttf'
import FiraSansMediumItalic from '../../assets/font/FiraSans/FiraSans-MediumItalic.ttf'
import FiraSansSemiBoldItalic from '../../assets/font/FiraSans/FiraSans-SemiBoldItalic.ttf'
import FiraSansBoldItalic from '../../assets/font/FiraSans/FiraSans-BoldItalic.ttf'

import RobotMonoLight from '../../assets/font/RobotMono/RobotoMono-Light.ttf'
import RobotMonoRegular from '../../assets/font/RobotMono/RobotoMono-Regular.ttf'
import RobotMonoMedium from '../../assets/font/RobotMono/RobotoMono-Medium.ttf'
import RobotMonoSemiBold from '../../assets/font/RobotMono/RobotoMono-SemiBold.ttf'
import RobotMonoBold from '../../assets/font/RobotMono/RobotoMono-Bold.ttf'
import RobotMonoLightItalic from '../../assets/font/RobotMono/RobotoMono-LightItalic.ttf'
import RobotMonoItalic from '../../assets/font/RobotMono/RobotoMono-Italic.ttf'
import RobotMonoMediumItalic from '../../assets/font/RobotMono/RobotoMono-MediumItalic.ttf'
import RobotMonoSemiBoldItalic from '../../assets/font/RobotMono/RobotoMono-SemiBoldItalic.ttf'
import RobotMonoBoldItalic from '../../assets/font/RobotMono/RobotoMono-BoldItalic.ttf'

import PoppinsLight from '../../assets/font/Poppins/Poppins-Light.ttf'
import PoppinsRegular from '../../assets/font/Poppins/Poppins-Regular.ttf'
import PoppinsMedium from '../../assets/font/Poppins/Poppins-Medium.ttf'
import PoppinsSemiBold from '../../assets/font/Poppins/Poppins-SemiBold.ttf'
import PoppinsBold from '../../assets/font/Poppins/Poppins-Bold.ttf'
import PoppinsLightItalic from '../../assets/font/Poppins/Poppins-LightItalic.ttf'
import PoppinsItalic from '../../assets/font/Poppins/Poppins-Italic.ttf'
import PoppinsMediumItalic from '../../assets/font/Poppins/Poppins-MediumItalic.ttf'
import PoppinsSemiBoldItalic from '../../assets/font/Poppins/Poppins-SemiBoldItalic.ttf'
import PoppinsBoldItalic from '../../assets/font/Poppins/Poppins-BoldItalic.ttf'

import AmiriBold from "../../assets/font/Amiri/Amiri-Bold.ttf"
import AmiriBoldItalic from "../../assets/font/Amiri/Amiri-Bold.ttf"
import AmiriItalic from "../../assets/font/Amiri/Amiri-Italic.ttf"
import AmiriRegular from "../../assets/font/Amiri/Amiri-Regular.ttf"

import NotoNaskhArabicRegular from "../../assets/font/NotoNaskhArabic/NotoNaskhArabic-Regular.ttf"
import NotoNaskhArabicMedium from "../../assets/font/NotoNaskhArabic/NotoNaskhArabic-Medium.ttf"
import NotoNaskhArabicSemiBold from "../../assets/font/NotoNaskhArabic/NotoNaskhArabic-SemiBold.ttf"
import NotoNaskhArabicBold from "../../assets/font/NotoNaskhArabic/NotoNaskhArabic-Bold.ttf"


export default function FontRegistration() {
  useEffect(() => {

  Font.register({
  family: 'Roboto',
  fonts: [
    // --- NORMAL STYLE ---
    { src: RobotoLight, fontWeight: 300, fontStyle: 'normal' },
    { src: RobotoRegular, fontWeight: 400, fontStyle: 'normal' },
    { src: RobotoMedium, fontWeight: 500, fontStyle: 'normal' },
    // SemiBold (600) - Using the Bold file if SemiBold is unavailable
    { src: RobotoBold, fontWeight: 600, fontStyle: 'normal' }, 
    { src: RobotoBold, fontWeight: 700, fontStyle: 'normal' },

    // --- ITALIC STYLE ---
    { src: RobotoLightItalic, fontWeight: 300, fontStyle: 'italic' },
    { src: RobotoItalic, fontWeight: 400, fontStyle: 'italic' },
    { src: RobotoMediumItalic, fontWeight: 500, fontStyle: 'italic' },
    // SemiBold (600) Italic - Using the base Italic file and letting PDF synthesize
    { src: RobotoItalic, fontWeight: 600, fontStyle: 'italic' }, 
    { src: RobotoBoldItalic, fontWeight: 700, fontStyle: 'italic' },
  ],
 });

 // 2. FiraSans
    // ------------------------------------
    Font.register({
      family: 'FiraSans',
      fonts: [
        // --- NORMAL STYLE ---
        { src: FiraSansLight, fontWeight: 300, fontStyle: 'normal' },
        { src: FiraSansRegular, fontWeight: 400, fontStyle: 'normal' },
        { src: FiraSansMedium, fontWeight: 500, fontStyle: 'normal' },
        { src: FiraSansSemiBold, fontWeight: 600, fontStyle: 'normal' },
        { src: FiraSansBold, fontWeight: 700, fontStyle: 'normal' },

        // --- ITALIC STYLE ---
        { src: FiraSansLightItalic, fontWeight: 300, fontStyle: 'italic' },
        { src: FiraSansItalic, fontWeight: 400, fontStyle: 'italic' },
        { src: FiraSansMediumItalic, fontWeight: 500, fontStyle: 'italic' },
        { src: FiraSansSemiBoldItalic, fontWeight: 600, fontStyle: 'italic' }, // Synthesized
        { src: FiraSansBoldItalic, fontWeight: 700, fontStyle: 'italic' },
      ],
    });
// 3. RobotoMono
    // ------------------------------------
    Font.register({
      family: 'RobotoMono',
      fonts: [
        // --- NORMAL STYLE ---
        { src: RobotMonoLight, fontWeight: 300, fontStyle: 'normal' },
        { src: RobotMonoRegular, fontWeight: 400, fontStyle: 'normal' },
        { src: RobotMonoMedium, fontWeight: 500, fontStyle: 'normal' },
        { src: RobotMonoSemiBold, fontWeight: 600, fontStyle: 'normal' },
        { src: RobotMonoBold, fontWeight: 700, fontStyle: 'normal' },

        // --- ITALIC STYLE ---
        { src: RobotMonoLightItalic, fontWeight: 300, fontStyle: 'italic' },
        { src: RobotMonoItalic, fontWeight: 400, fontStyle: 'italic' },
        { src: RobotMonoMediumItalic, fontWeight: 500, fontStyle: 'italic' },
        { src: RobotMonoSemiBoldItalic, fontWeight: 600, fontStyle: 'italic' }, // Synthesized
        { src: RobotMonoBoldItalic, fontWeight: 700, fontStyle: 'italic' },
      ],
    });
// 4. Poppins
    // ------------------------------------
    Font.register({
      family: 'Poppins',
      fonts: [
        // --- NORMAL STYLE ---
        { src: PoppinsLight, fontWeight: 300, fontStyle: 'normal' },
        { src: PoppinsRegular, fontWeight: 400, fontStyle: 'normal' },
        { src: PoppinsMedium, fontWeight: 500, fontStyle: 'normal' }, // Uses dedicated Medium file
        { src: PoppinsSemiBold, fontWeight: 600, fontStyle: 'normal' },
        { src: PoppinsBold, fontWeight: 700, fontStyle: 'normal' },

        // --- ITALIC STYLE ---
        { src: PoppinsLightItalic, fontWeight: 300, fontStyle: 'italic' },
        { src: PoppinsItalic, fontWeight: 400, fontStyle: 'italic' },
        { src: PoppinsMediumItalic, fontWeight: 500, fontStyle: 'italic' },
        { src: PoppinsSemiBoldItalic, fontWeight: 600, fontStyle: 'italic' }, // Synthesized
        { src: PoppinsBoldItalic, fontWeight: 700, fontStyle: 'italic' },
      ],
    });

// ------------------------------------
    // 5. NotoNaskhArabic (Arabic)
    // ------------------------------------
    // *Reminder: No native italic style exists for Noto Naskh Arabic. Italic requests will be synthesized/slanted.*
    Font.register({
      family: 'NotoNaskhArabic',
      fonts: [
        // --- NORMAL STYLE --- (Uses available R, M, SB, B files)
        { src: NotoNaskhArabicRegular, fontWeight: 300, fontStyle: 'normal' }, // Synthesized
        { src: NotoNaskhArabicRegular, fontWeight: 400, fontStyle: 'normal' },
        { src: NotoNaskhArabicMedium, fontWeight: 500, fontStyle: 'normal' },
        { src: NotoNaskhArabicSemiBold, fontWeight: 600, fontStyle: 'normal' },
        { src: NotoNaskhArabicBold, fontWeight: 700, fontStyle: 'normal' },

        // --- ITALIC STYLE --- (All use the Medium file as the base for synthesis/slanting)
        { src: NotoNaskhArabicMedium, fontWeight: 300, fontStyle: 'italic' },
        { src: NotoNaskhArabicMedium, fontWeight: 400, fontStyle: 'italic' },
        { src: NotoNaskhArabicMedium, fontWeight: 500, fontStyle: 'italic' },
        { src: NotoNaskhArabicMedium, fontWeight: 600, fontStyle: 'italic' },
        { src: NotoNaskhArabicMedium, fontWeight: 700, fontStyle: 'italic' }, // Using Bold Italic placeholder
      ],
    });

// ------------------------------------
    // 6. Amiri (Arabic)
    // ------------------------------------
    // *Reminder: Amiri HAS native italic/slanted styles.*
    Font.register({
      family: 'Amiri',
      fonts: [
        // --- NORMAL STYLE ---
        { src: AmiriRegular, fontWeight: 300, fontStyle: 'normal' },
        { src: AmiriRegular, fontWeight: 400, fontStyle: 'normal' },
        { src: AmiriRegular, fontWeight: 500, fontStyle: 'normal' },
        { src: AmiriBold, fontWeight: 600, fontStyle: 'normal' },
        { src: AmiriBold, fontWeight: 700, fontStyle: 'normal' },

        // --- ITALIC STYLE ---
        { src: AmiriItalic, fontWeight: 300, fontStyle: 'italic' },
        { src: AmiriItalic, fontWeight: 400, fontStyle: 'italic' },
        { src: AmiriItalic, fontWeight: 500, fontStyle: 'italic' },
        { src: AmiriItalic, fontWeight: 600, fontStyle: 'italic' },
        { src: AmiriBoldItalic, fontWeight: 700, fontStyle: 'italic' }, // Using dedicated BoldItalic file if available
      ],
    });
    

  }, []);

  return null;
}