import axios from 'axios';


class MyUploadAdapter {

    constructor( loader ) {
        // The file loader instance to use during the upload.
        this.loader = loader;
    }

    // Starts the upload process.
    upload() {
        return this.loader.file
            .then( file => new Promise( async ( resolve, reject ) => {
                const config = {
                    headers: {
                        "content-type": "multipart/form-data",
                        Authorization: `Bearer ${
                        JSON.parse(localStorage.getItem("user_information")).jwt
                        }`,
                    },
                };
                const formData = new FormData();
                formData.append("files", file, file.name);
                const imgResponse = await axios.post(`${process.env.REACT_APP_STRAPI_BASE_URL}/upload`, formData, config);
                const imgData = imgResponse.data[0];
                resolve({
                    default: `${process.env.REACT_APP_STRAPI_BASE_URL}${imgData.url}`
                })
            } ) );
    }

    // Aborts the upload process.
    abort() {
        if ( this.xhr ) {
            this.xhr.abort();
        }
    }
}

export default function MyCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter( loader );
    }
}