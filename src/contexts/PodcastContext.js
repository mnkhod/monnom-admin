import React, { createContext, useState, useContext } from "react"

let PodcastContext = createContext()

function PodcastContextProvider({ children }) {
  const [podcasts, set_podcasts] = useState([])
  return (
    <PodcastContext.Provider
      value={{
        podcasts,
        set_podcasts,
      }}
    >
      {children}
    </PodcastContext.Provider>
  )
}

let PodcastStates = () => {
  let { podcasts, set_podcasts } = useContext(PodcastContext)

  return {
    podcasts,
    set_podcasts,
  }
}

export { PodcastContext, PodcastContextProvider, PodcastStates }
