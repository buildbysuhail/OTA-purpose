'use client'

import React, { useEffect } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'animate.css'

// Initialize SweetAlert with React content

interface ERPAlertProps {
  title: string
  text?: string
  type?: string
  width?:number
  showAnimation?:'animate__fadeInDown' | 'animate__bounceIn' | 'animate__fadeIn' | 'animate__backInDown' 
  hideAnimation?:'animate__fadeOutDown' | 'animate__bounceOut' | 'animate__fadeOut' | 'animate__backOutDown'
  icon?: 'warning' | 'error' | 'success' | 'info' | 'question'
  position?: 'center'|'center-end'|'center-start' | 'top' | 'top-start' | 'top-end' | 'bottom'   
  confirmButtonText?: string
  cancelButtonText?: string
  onConfirm?: (result?: any) => void
  onCancel?: () => void
}

export default function ERPAlert({
  title,
  text="",
  width=450,
  showAnimation='animate__fadeInDown',
  hideAnimation='animate__fadeOutDown',
  icon = 'warning',
  position='center',
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  onConfirm,
  onCancel
}: ERPAlertProps) {
  useEffect(() => {
    Swal.fire({
      title: title,
      text: text,
      width:width,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      position: position,
      showClass: {
        popup: `animate__animated ${showAnimation} animate__faster`
      },
      hideClass: {
        popup: `animate__animated ${hideAnimation} animate__faster`
      },

    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm && onConfirm()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        onCancel && onCancel()
      }
    })
  }, [title, text, icon, confirmButtonText, cancelButtonText, onConfirm, onCancel])

  return null
}

// Utility function for showing alerts
ERPAlert.show = (options: ERPAlertProps) => {
  return Swal.fire({
    title: options.title,
    text: options.text,
    width: options.width || 450,
    icon: options.icon || 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: options.confirmButtonText || 'Confirm',
    cancelButtonText: options.cancelButtonText || 'Cancel',
    position: options.position || 'center',
    showClass: {
      popup: `animate__animated ${options.showAnimation || 'animate__fadeInDown'} animate__faster`
    },
    hideClass: {
      popup: `animate__animated ${options.hideAnimation || 'animate__fadeOutDown'} animate__faster`
    },
  }).then((result) => {
    if (result.isConfirmed) {
      options.onConfirm && options.onConfirm()
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      options.onCancel && options.onCancel()
    }
  })
}