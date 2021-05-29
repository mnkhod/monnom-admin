import React, {useState, useMemo} from 'react'
import SweetAlert from "react-bootstrap-sweetalert"

export const ResultPopUp = React.createContext()

export const PopUp = ({ children }) => {

  const [state, set_state] = useState({
    success: false,
    error: false,
    loading: false
  })

  const visiblePopup = useMemo(() => {
    if(state.loading)  {
      return <SweetAlert
      title="Түр хүлээнэ үү"
      info
      showCloseButton={false}
      showConfirm={false}
      success
    ></SweetAlert>    
    } else if(state.success) {
      return <SweetAlert
      title={"Амжилттай"}
      timeout={2000}
      style={{
        position: "absolute",
        top: "center",
        right: "center",
      }}
      showCloseButton={false}
      showConfirm={false}
      success
      onConfirm={() => {
        set_state({success: false})
      }}
    >
      {"Үйлдэл амжилттай боллоо"}
    </SweetAlert>
    } else if(state.error) {
      return <SweetAlert
      title={"Амжилтгүй"}
      timeout={2000}
      style={{
        position: "absolute",
        top: "center",
        right: "center",
      }}
      showCloseButton={false}
      showConfirm={false}
      error
      onConfirm={() => {
        set_state({error: false})
      }}
    >
      {"Үйлдэл амжилтгүй боллоо"}
    </SweetAlert>
    }
    return <></>
  }, [state]);


  return (
    <ResultPopUp.Provider 
      value={[state, set_state]}>
        {visiblePopup}
        {children}
    </ResultPopUp.Provider>
  )
}