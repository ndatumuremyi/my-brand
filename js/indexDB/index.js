 export const tables = {
    blogs:'blogs',
    comments:'comments',
     likes:'likes'
}

 function connect(name, version) {
     return new Promise((resolve, reject) => {
         const request = indexedDB.open(name, version);
         request.onupgradeneeded = function() {
            // triggers if the client had no database
            // ...perform initialization...
             let db = request.result
             db.onversionchange = function() {
                 db.close();
                 console.error("Database is outdated, please reload the page.")
             };
             Object.keys(tables).forEach(eachTable => {
                 if (!db.objectStoreNames.contains(tables[eachTable])) { // if there's no "books" store
                     db.createObjectStore(tables[eachTable], {keyPath: 'id', autoIncrement:true}); // create it
                 }
             })

         };
         request.onsuccess = () => resolve(request.result);
         request.onerror = () => reject(request.error);
         request.onblocked = () => console.warn('pending till unblocked');
     });
 }



 function storeData(conn, tableName, data) {
     return new Promise((resolve, reject) => {
         const tx = conn.transaction(tableName, 'readwrite');
         const store = tx.objectStore(tableName);
         const request = store.put(data);
         request.onsuccess = () => resolve(request.result);
         request.onerror = () => reject(request.error);
     });
 }

function getData(conn, tableName) {
     return new Promise((resolve, reject) => {
         const tx = conn.transaction(tableName);
         const store = tx.objectStore(tableName);
         const request = store.getAll()

         request.onsuccess = () => resolve(request.result);
         request.onerror = () => reject(request.error);
     });
 }
function getOneData(conn, tableName, id) {
     return new Promise((resolve, reject) => {
         const tx = conn.transaction(tableName);
         const store = tx.objectStore(tableName);
         const request = store.get(id)

         request.onsuccess = () => resolve(request.result);
         request.onerror = () => reject(request.error);
     });
 }
function deleteOneData(conn, tableName, id) {
     return new Promise((resolve, reject) => {
         const tx = conn.transaction(tableName,'readwrite');
         const store = tx.objectStore(tableName);
         const request = store.delete(id)

         request.onsuccess = () => resolve(request.result);
         request.onerror = () => reject(request.error);
     });
 }










export async function add(tableName, data){
    let conn;
    try {
        conn = await connect("myBrand", 1);
        await storeData(conn, tableName, data);
    } finally {
        if(conn)
            conn.close();
    }

}
export async function deleteOne(tableName, id){
    let conn;
    try {
        conn = await connect("myBrand", 1);
        return  deleteOneData(conn, tableName, id);
    } finally {
        if(conn)
            conn.close();
    }
}

export async function getAll(tableName) {
    let conn;
    try {
        conn = await connect("myBrand", 1);
        return  getData(conn, tableName);
    } finally {
        if(conn)
            conn.close();
    }
}
export async function getOne(tableName, id){
    let conn;
    try {
        conn = await connect("myBrand", 1);
        return  getOneData(conn, tableName, id);
    } finally {
        if(conn)
            conn.close();
    }
}