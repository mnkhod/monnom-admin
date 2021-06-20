import React, { useEffect, useState, useContext } from "react"
import { Row, Col, Button } from "reactstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { useLiveChannelStates } from "../../contexts/LiveChannelContext"
import axios from "axios"
import { ResultPopUp } from "../../contexts/CheckActionsContext"

const GRID = 8

// fake data generator
const getItems = files => {
   files.sort((a, b) => (a.stack_number > b.stack_number ? 1 : b.stack_number > a.stack_number ? -1 : 0))
   let tempArray = []
   Object.keys(files).map((key, index) => {
      tempArray.push({
         id: `item-${files[key].id}`,
         content: files[key].audio_name,
         size: files[key].audio?.size,
         audio_id: files[key].id,
      })
   })
   return tempArray
}

const getUploadItems = files => {
   // return [];
   let tempArray = []
   Object.keys(files).map((key, index) => {
      tempArray.push({
         id: `item-${index}`,
         content: files[key].name,
         size: files[key].size,
      })
   })
   return tempArray
}

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
   const result = Array.from(list)
   const [removed] = result.splice(startIndex, 1)
   result.splice(endIndex, 0, removed)

   return result
}

const getItemStyle = (isDragging, draggableStyle) => ({
   // some basic styles to make the items look a bit nicer
   userSelect: "none",
   padding: GRID * 2,
   margin: `0 0 ${GRID}px 0`,
   // styles we need to apply on draggables
   ...draggableStyle,
})

const getListStyle = isDraggingOver => ({
   background: isDraggingOver ? "lightgreen" : "white",
   padding: GRID,
})

const Live = () => {
   const [state, set_state] = useContext(ResultPopUp)

   const { selectedCard, setselectedCard, edit_live_channel, set_edit_live_channel } = useLiveChannelStates()

   const [old_files, set_old_files] = useState([])

   // const [old_files, set_old_files] = useState(getItems(liveState.lives));

   const [searchItms, setSearchItms] = useState("")
   const [channel_name, set_channel_name] = useState("")
   const [remove_upload_file_name, set_remove_upload_file_name] = useState("")
   const [confirm_remove_file, set_confirm_remove_file] = useState(false)
   const [remove_old_file_id, set_remove_old_file_id] = useState("")
   const [upload_files, set_upload_files] = useState([])
   const [is_stack_sequence_changed, set_is_stack_sequence_changed] = useState(false)
   const [audio_files_for_save, set_audio_files_for_save] = useState([])
   const [latest_stack_number, set_latest_stack_number] = useState(0)

   // delete old file
   const deleteFile = async () => {
      set_state({ loading: false })

      const config = {
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }
      await axios
         .delete(`${process.env.REACT_APP_STRAPI_BASE_URL}/radio-channel-audios/${remove_old_file_id}`, config)
         .then(async res => {
            set_state({ success: true })
            setTimeout(() => {
               window.location.reload()
            }, 2000)
         })
         .catch(err => {
            set_state({ error: true })
         })
   }

   // add file from live
   const createFile = async () => {
      set_state({ loading: true })

      const config = {
         headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }

      let tempAudioRequests = []
      let promises = []

      audio_files_for_save.forEach((file, index) => {
         promises.push(
            getAudioFileDuration(audio_files_for_save[index])
               .then(resp => {
                  let audio_duration = resp
                  let tempFormData = new FormData()
                  let data = {
                     audio_name: audio_files_for_save[index].name.split(".").slice(0, -1).join("."),
                     radio_channel: edit_live_channel,
                     stack_number: latest_stack_number + index,
                     audio_duration: audio_duration.toString(),
                  }
                  tempFormData.append("data", JSON.stringify(data))
                  tempFormData.append("files.audio", audio_files_for_save[index], audio_files_for_save[index].name)
                  tempAudioRequests.push({
                     url: `${process.env.REACT_APP_STRAPI_BASE_URL}/radio-channel-audios`,
                     formdata: tempFormData,
                  })
               })
               .catch(err => {
                  set_state({ error: true })
               })
         )
      })

      Promise.all(promises)
         .then(() => {
            axios
               .all(tempAudioRequests.map(tempRequest => axios.post(tempRequest.url, tempRequest.formdata, config)))
               .then(() => {
                  set_state({ success: true })
                  setTimeout(() => {
                     window.location.reload()
                  }, 2000)
               })
               .catch(err => {
                  set_state({ error: true })
               })
         })
         .catch(e => {
            set_state({ error: true })
         })
   }

   const updateFiles = async () => {
      const config = {
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }

      let tempStackSequence = old_files.map((file, index) => {
         return {
            id: file.audio_id,
            index,
         }
      })

      axios
         .all(tempStackSequence.map(stack => axios.put(`${process.env.REACT_APP_STRAPI_BASE_URL}/radio-channel-audios/${stack.id}`, { stack_number: stack.index }, config)))
         .then(() => {
            set_state({ loading: false })
            set_state({ success: true })
            setTimeout(() => {
               window.location.reload()
            }, 2000)
         })
         .catch(err => {
            set_state({ loading: false })
            set_state({ error: true })
         })
   }

   // mp3 file upload hiih, nemeh
   const uploadLiveFiles = e => {
      var files = e.target.files
      set_upload_files(getUploadItems(files))
      let tempfiles = []
      for (let i = 0; i < files.length; i++) {
         tempfiles.push(files[i])
      }

      set_audio_files_for_save(tempfiles)
   }

   const getAudioFileDuration = file =>
      new Promise((resolve, reject) => {
         let audio = document.createElement('audio');
         let objectUrl = URL.createObjectURL(file);
         audio.src = objectUrl;
         audio.addEventListener('loadedmetadata', () => {
            console.log(`audio duration: ${audio.duration}`);
            resolve(audio.duration);
         })
         // let reader = new FileReader()
         // reader.onload = function (event) {
         //    let audioContext = new (window.AudioContext || window.webkitAudioContext)()
         //    audioContext.decodeAudioData(event.target.result).then(buffer => {
         //       resolve(buffer.duration)
         //    })
         // }
         // reader.readAsArrayBuffer(file)
      })

   // upload hiij bga mp3 file aa ustgah
   const removeAudioBookFiles = f => {
      set_upload_files(upload_files.filter(x => x !== f))
      set_audio_files_for_save(audio_files_for_save.filter(x => x.name !== f.content))
   }

   // const removeOldAudioBookFiles = f => {
   //    set_old_files(old_files.filter(x => x.audio_id !== f))
   // }

   // upload hiisen file uudiin zooh, indexuudiig zaaj ogoh
   const onDragEnd = result => {
      // dropped outside the list
      if (!result.destination) {
         return
      }

      const items = reorder(upload_files, result.source.index, result.destination.index)

      set_upload_files(items)
   }

   useEffect(() => {
      if (edit_live_channel != null) {
         let tempCard = selectedCard.find(card => card.id == edit_live_channel)
         set_latest_stack_number(
            Math.max.apply(
               Math,
               tempCard.radio_channel_audios.map(function (o) {
                  return o.stack_number
               })
            ) + 1
         )
         set_old_files(getItems(tempCard.radio_channel_audios))
         set_channel_name(tempCard.name)
      }
   }, [edit_live_channel])

   // huuchin file uudiin zooh, indexuudiig zaaj ogoh
   const oldOnDragEnd = result => {
      set_is_stack_sequence_changed(true)
      // dropped outside the list
      if (!result.destination) {
         return
      }

      const items = reorder(old_files, result.source.index, result.destination.index)

      set_old_files(items)
   }

   const formatBytes = (bytes, decimals = 2) => {
      if (bytes === 0) return "0 Bytes"
      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

      const i = Math.floor(Math.log(bytes) / Math.log(k))
      const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
      return size
      // set_file_size(size);
   }

   return (
      <React.Fragment>
         {edit_live_channel != null && (
            <>
               <div className="mt-2">
                  <Row className="mb-3">
                     <Col xl={12} sm={6}>
                        <div className="mt-2">
                           <h5>{channel_name}</h5>
                        </div>
                     </Col>
                  </Row>
                  <Row className="mb-4">
                     <input type="file" accept=".mp3" multiple id="file_upload" className="invisible" onChange={e => uploadLiveFiles(e)} />
                     <Col xl={12} className="mx-auto d-flex justify-content-around">
                        <label htmlFor="file_upload" className="custom-file-upload h-100">
                           <i
                              className="btn btn-light font-size-13 h-100 pt-2 pb-1 px-4"
                              style={{
                                 cursor: "pointer",
                              }}
                           >
                              Файл оруулах
                           </i>
                        </label>
                        <Button
                           className="btn py-2 px-4"
                           color="success"
                           onClick={() => {
                              if (audio_files_for_save.length != 0) {
                                 createFile()
                              }
                           }}
                        >
                           Лайвд нэмэх
                        </Button>
                     </Col>
                  </Row>
                  <hr className="mt-2" />

                  <div className="table-responsive file-manager mb-4">
                     {upload_files.map((item, index) => (
                        <div key={index} className="file-preview bg-light px-3 py-2 d-flex align-items-center border rounded mt-3">
                           <i className="bx bxs-music w-10 font-size-22 text-warning mr-2" />

                           {item.content.length > 25 ? (
                              <p
                                 style={{
                                    color: "#000",
                                    margin: "auto",
                                    marginLeft: "5px",
                                    width: "45%",
                                 }}
                              >
                                 {item.content.slice(0, 21)}
                                 {"... "}
                                 {item.content.slice(item.content.length - 4, item.content.length)}
                              </p>
                           ) : (
                              <p
                                 style={{
                                    color: "#000",
                                    margin: "auto",
                                    marginLeft: "5px",
                                    width: "45%",
                                 }}
                              >
                                 {item.content}
                              </p>
                           )}

                           <p className="text-dark my-auto ">{formatBytes(item.size)}</p>
                           <i
                              className="dripicons-cross font-size-20 my-auto text-dark"
                              onClick={() => {
                                 removeAudioBookFiles(item)
                              }}
                              removeFile={(this, item)}
                              style={{
                                 cursor: "pointer",
                                 margin: "auto",
                                 marginRight: "0",
                              }}
                           />
                        </div>
                     ))}
                  </div>

                  <div className="table-responsive file-manager border-top border-dark">
                     <DragDropContext onDragEnd={oldOnDragEnd}>
                        <Droppable droppableId="droppable">
                           {(provided, snapshot) => (
                              <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                                 {old_files
                                    .filter(val => {
                                       if (searchItms === "") {
                                          return val
                                       } else if (val.content.toLocaleLowerCase().includes(searchItms.toLocaleLowerCase())) {
                                          return val
                                       }
                                    })
                                    .map((item, index) => (
                                       <Draggable key={item.id} draggableId={item.id} index={index}>
                                          {(provided, snapshot) => (
                                             <div className="file-preview bg-success py-2 d-flex align-items-center border rounded mt-3" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                                                <i className="bx bxs-music w-10 font-size-22 text-dark mr-2" />

                                                {item.content.length > 25 ? (
                                                   <p
                                                      style={{
                                                         color: "#000",
                                                         margin: "auto",
                                                         marginLeft: "5px",
                                                         width: "45%",
                                                      }}
                                                   >
                                                      {item.content.slice(0, 21)}
                                                      {"... "}
                                                      {item.content.slice(item.content.length - 4, item.content.length)}
                                                   </p>
                                                ) : (
                                                   <p
                                                      style={{
                                                         color: "#000",
                                                         margin: "auto",
                                                         marginLeft: "5px",
                                                         width: "45%",
                                                      }}
                                                   >
                                                      {item.content}
                                                   </p>
                                                )}

                                                <p className="text-dark my-auto ">{formatBytes(item.size)}</p>
                                                <i
                                                   className="dripicons-cross font-size-20 my-auto text-dark"
                                                   onClick={() => {
                                                      set_confirm_remove_file(true)
                                                      set_remove_old_file_id(item.audio_id)
                                                   }}
                                                   removeFile={(this, item)}
                                                   style={{
                                                      cursor: "pointer",
                                                      margin: "auto",
                                                      marginRight: "0",
                                                   }}
                                                />
                                             </div>
                                          )}
                                       </Draggable>
                                    ))}
                                 {provided.placeholder}
                                 {/* </Scrollbars> */}
                              </div>
                           )}
                        </Droppable>
                     </DragDropContext>
                  </div>
               </div>
               {is_stack_sequence_changed && (
                  <Button
                     className="btn py-2 px-4"
                     color="success"
                     onClick={() => {
                        set_state({ loading: true })
                        updateFiles()
                     }}
                  >
                     Өөрчлөх
                  </Button>
               )}
               {confirm_remove_file ? (
                  <SweetAlert
                     title="Та итгэлтэй байна уу ?"
                     warning
                     showCancel
                     confirmBtnText="Тийм!"
                     cancelBtnText="Болих"
                     confirmBtnBsStyle="success"
                     cancelBtnBsStyle="danger"
                     onConfirm={() => {
                        set_confirm_remove_file(false)
                        set_state({ loading: true })
                        deleteFile()
                     }}
                     onCancel={() => {
                        set_confirm_remove_file(false)
                     }}
                  ></SweetAlert>
               ) : null}
            </>
         )}
      </React.Fragment>
   )
}

export default Live
