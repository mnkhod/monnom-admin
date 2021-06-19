import React, { useState } from 'react'
import { MDBDataTable, } from "mdbreact"
import { Badge } from 'reactstrap';

function NotificationsTable(props) {

    const data = {
        columns: [
            {
                label: "id",
                field: "id",
                sort: "desc",
                width: 150,
            },
            {
                label: "Гарчиг",
                field: "title",
                sort: "desc",
                width: 150,
            },
            {
                label: "Мессеж",
                field: "body",
                sort: "desc",
                width: 150,
            },
            {
                label: 'Төлөв',
                field: 'state',
                width: 150
            },
            {
                label: "Огноо",
                field: "created_at",
                sort: "desc",
                width: 100,
            },
        ],
        rows: props.data.map((row) => {
            let stateName = 'Илгээж байна';
            let stateColor = 'primary';
            switch (row.state) {
                case 'sent':
                    stateColor = 'success';
                    break;
                case 'success':
                    stateColor = 'success';
                    stateName = 'Илгээсэн';
                    break;
                case 'error':
                    stateName = 'Алдаа'
                    stateColor = 'danger';
                    break;
                case 'sending':
                    stateColor = 'primary'
                    break;
            }
            return {
                ...row,
                state: (<Badge color={stateColor} style={{ fontSize: '1rem' }}>{stateName}</Badge>)
            }
        }),
    }

    return (
        <MDBDataTable
            proSelect
            responsive
            bordered
            data={data}
            noBottomColumns
            noRecordsFoundLabel={"Notification илгээгээгүй"}
            infoLabel={["", "-ээс", "дахь хэрэглэгч. Нийт", ""]}
            entries={10}
            entriesOptions={[10, 15, 20]}
            paginationLabel={["Өмнөх", "Дараах"]}
            searchinglabel={"Хайх"}
            searching
        />
    )
}

export default NotificationsTable
