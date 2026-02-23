!macro customInit
  # Kill running app silently before install
  nsExec::Exec 'taskkill /IM "Polosys.exe" /F'
!macroend
