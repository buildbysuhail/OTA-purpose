'use client'

import React, { useEffect } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'animate.css'

// Initialize SweetAlert with React content
const MySwal = withReactContent(Swal)

interface ERPAlertProps {
  title: string
  text?: string
  width?:number
  showAnimation?:'animate__fadeInDown' | 'animate__bounceIn' | 'animate__fadeIn' | 'animate__backInDown' 
  hideAnimation?:'animate__fadeOutDown' | 'animate__bounceOut' | 'animate__fadeOut' | 'animate__backOutDown'
  icon?: 'warning' | 'error' | 'success' | 'info' | 'question'
  position?: 'center'|'center-end'|'center-start' | 'top' | 'top-start' | 'top-end' | 'bottom'   
  confirmButtonText?: string
  cancelButtonText?: string
  onConfirm: () => void
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
    MySwal.fire({
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
      //if want any custome style use customClass  now it just a demo class 
      customClass: {
        container: 'erp-alert-container',
        popup: 'erp-alert-popup',
        title: 'erp-alert-title',
        closeButton: 'erp-alert-close',
        icon: 'erp-alert-icon',
        image: 'erp-alert-image',
        htmlContainer: 'erp-alert-content',
        input: 'erp-alert-input',
        inputLabel: 'erp-alert-input-label',
        validationMessage: 'erp-alert-validation',
        actions: 'erp-alert-actions',
        confirmButton: 'erp-alert-confirm',
        denyButton: 'erp-alert-deny',
        cancelButton: 'erp-alert-cancel',
        loader: 'erp-alert-loader',
        footer: 'erp-alert-footer'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        onCancel && onCancel()
      }
    })
  }, [title, text, icon, confirmButtonText, cancelButtonText, onConfirm, onCancel])

  return null
}