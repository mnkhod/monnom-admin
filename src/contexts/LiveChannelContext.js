import React, { createContext, useState, useEffect, useContext } from "react"
import axios from "axios"

let LiveChannelContext = createContext()

function LiveChannelContextProvider({ children }) {
  const [live_channels, set_live_channels] = useState([])
  const [selectedCard, setSelectedCard] = useState([])
  const [edit_live_channel, set_edit_live_channel] = useState(null)

  // Check network
  const [isNetworking, setIsNetworking] = useState(false)

  async function fetchData() {
    await axios({
      url: `${process.env.REACT_APP_STRAPI_BASE_URL}/radio-channels/`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("user_information")).jwt
        }`,
      },
    })
      .then(res => {
        set_live_channels(res.data)
        setSelectedCard(res.data)
        setIsNetworking(false)
      })
      .catch(err => {
        setIsNetworking(true)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <LiveChannelContext.Provider
      value={{
        selectedCard,
        setSelectedCard,
        live_channels,
        set_live_channels,
        edit_live_channel,
        set_edit_live_channel,
      }}
    >
      {children}
    </LiveChannelContext.Provider>
  )
}

let useLiveChannelStates = () => {
  let {
    selectedCard,
    setSelectedCard,
    live_channels,
    set_live_channels,
    edit_live_channel,
    set_edit_live_channel,
  } = useContext(LiveChannelContext)

  return {
    selectedCard,
    setSelectedCard,
    live_channels,
    set_live_channels,
    edit_live_channel,
    set_edit_live_channel,
  }
}

export { LiveChannelContext, LiveChannelContextProvider, useLiveChannelStates }
