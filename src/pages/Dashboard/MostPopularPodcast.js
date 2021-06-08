import React, { useState, useEffect } from "react"
import { Card, CardBody, CardTitle, Table, CardSubtitle } from "reactstrap"

const MostPopularPodcast = props => {
   const [podcasts, set_podcasts] = useState([])

   useEffect(() => {
      set_podcasts(props.mostFollowedPodcastChannels)
   }, [props])

   return (
      <>
         {podcasts.length != 0 ? (
            <Card>
               <CardBody>
                  <CardTitle>Хамгийн олон дагагчтай подкаст сувгууд</CardTitle>
                  <CardSubtitle className="mb-3"></CardSubtitle>

                  <div className="table-responsive">
                     <Table className="table mb-0">
                        <thead>
                           <tr>
                              <th>Дугаар</th>
                              <th>Нэр</th>
                              <th>Онцлох</th>
                              <th>Нийт дагагчид</th>
                           </tr>
                        </thead>
                        <tbody>
                           {podcasts.map((podcast, index) => (
                              <tr key={index}>
                                 <td>{podcast.id + index}</td>
                                 <td>{podcast.name}</td>
                                 <td>{podcast.is_featured}</td>
                                 <td>{podcast.saves_count}</td>
                              </tr>
                           ))}
                        </tbody>
                     </Table>
                  </div>
               </CardBody>
            </Card>
         ) : (
            []
         )}
      </>
   )
}

export default MostPopularPodcast
