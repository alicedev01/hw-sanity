import {DocumentActionComponent} from '@sanity/base'
import {useEffect, useState} from 'react'

export const FOO: DocumentActionComponent = () => {
  const [isDisabled, setDisabled] = useState(true)
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setDisabled((val) => !val)
      setCounter((p) => p + 1)
    }, 2000)

    return () => clearInterval(id)
  }, [])

  return {
    label: `Hel!lo ${counter} [${isDisabled ? 'disabled' : 'enabled'}]`,
    disabled: isDisabled,
  }
}

export const BAR: DocumentActionComponent = () => ({
  label: 'Hello2',
  disabled: true,
})

export const BAZ: DocumentActionComponent = () => ({
  label: 'Hello [enabled]',
  disabled: false,
})

export const QUX: DocumentActionComponent = () => {
  const [isDisabled, setDisabled] = useState(false)
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setDisabled((val) => !val)
      setCounter((prev) => prev + 1)
    }, 2000)

    return () => {
      clearInterval(id)
    }
  }, [])

  return {
    label: `Hello ${counter} [${isDisabled ? 'disabled' : 'enabled'}]`,
    disabled: isDisabled,
  }
}
