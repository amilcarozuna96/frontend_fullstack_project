import './App.css';
import './bootstrap/dist/css/bootstrap/min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import { useState, useEffect } from 'react';

function App() {

  const baseUrl = ""; //aquí va la liga url del localhost donde carga el API
  const [data, setData] = useState([]);

  const [editModal, setEditModal] = useState(false); //Estado para el modal de Update
  const [insertModal, setInsertModal] = useState(false); //Estado para el modal de Add
  const [deleteModal, setDeleteModal] = useState(false); //Estado para el modal de Delete

  const [selectedProperty, setSelectedProperty] = useState({
    id: "",
    Name: "",
    Lastname: "",
    Location: "",
    Phone: ""
  });
  const handleChange = e=> { //Con este método se captura lo que el usuario meta en los inputs y se guarda en el estado
    const {name, value} = e.target;
    setSelectedProperty({
      ...selectedProperty, 
      [name]: value
    });
    console.log(selectedProperty)
  }


  const openCloseInsertModal = () => {
    setInsertModal(!insertModal);
  }

  const openCloseEditModal = () => {
    setInsertModal(!insertModal);
  }

  const openCloseDeleteModal = () => {
    setDeleteModal(!insertModal);
  }


  //GET
  const peticionGet = async () => {  //la petición debe ser async porque debe trabajar en 2do plano
    await axios.get(baseUrl)
    .then(response => { //Si la respuesta es exitosa...
      setData(response.data); //Se guarda en el estado
    }).catch(error => { //Si no es exitosa
      console.log(error); //Muestra un error
    })
  }

  //POST
  const peticionPost = async () => { 
    delete selectedProperty.id;  
    await axios.get(baseUrl, selectedProperty)
    .then(response => { 
      setData(data.concat(response.data));
      openCloseInsertModal(); 
    }).catch(error => { 
      console.log(error); 
    })
  }


  //PUT
  const peticionPut = async () => {
    await axios.put(baseUrl + "./" + selectedProperty.id, selectedProperty)
    .then(response => { 
      var response= response.data;
      var auxilarData= data;
      auxilarData.map(property => {
        if(property.id === selectedProperty.id)
        {
          property.Name=response.Name;
          property.Lastname=response.Lastname;
          property.Location=response.Location;
          property.Phone=response.Phone;
        }
      });
      openCloseEditModal(); 
    }).catch(error => { 
      console.log(error); 
    })
  }


  //DELETE
  const peticionDelete = async () => {
    await axios.delete(baseUrl + "./" + selectedProperty.id)
    .then(response => { 
      setData(data.filter(property => property.id!== response.data));
      openCloseDeleteModal(); 
    }).catch(error => { 
      console.log(error); 
    })
  }

  const selectProperty = (property, caso) => {
    setSelectedProperty(property);
    (caso === "edit") ?
    openCloseEditModal(): openCloseDeleteModal();
  }

  useEffect(() => {
    peticionGet();
  }, [])

  return (
    <div className="App">
      <br></br>
      <button onClick={() => openCloseInsertModal()} className="btn btn-success">Add New User</button>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Last Name</th>
            <th>Location</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>   
        </thead>
        <tbody>
          {data.map(propiedad => {
            <tr key={propiedad.id}>
              <td>{propiedad.id}</td>
              <td>{propiedad.Name}</td>
              <td>{propiedad.Lastname}</td>
              <td>{propiedad.Location}</td>
              <td>{propiedad.Phone}</td>
              <td>
                <button className='btn btn-primary' onClick={selectProperty(property, "edit")}>Update</button>{"  "}
                <button className='btn btn-danger' onClick={selectProperty(property, "delete")}>Delete</button>{"   "}
              </td>
            </tr>
          })}
        </tbody>          
      </table>

      <Modal isOpen={insertModal}>
        <ModalHeader>Add New User</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>Name:</label>
            <br/>
            <input type="text" className='form-control' name='Name' onChange={handleChange}></input>
            <br/>
            <label>Last Name:</label>
            <br/>
            <input type="text" className='form-control' name='Lastname' onChange={handleChange}></input>
            <br/>
            <label>Location:</label>
            <br/>
            <input type="text" className='form-control' name='Locaction' onChange={handleChange}></input>
            <br/>
            <label>Phone:</label>
            <br/>
            <input type="text" className='form-control' name='Phone' onChange={handleChange}></input>
            <br/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary'onClick={() => peticionPost()}>Add</button>{"  "}
          <button className='btn btn-danger' onClick={() => openCloseEditModal()}>Cancel</button>{"  "}
        </ModalFooter>
      </Modal>


      <Modal isOpen={editModal}>
        <ModalHeader>Update New User</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>ID:</label>
            <br/>
            <input type="text" className='form-control' readOnly value={selectedProperty && selectedProperty.id}></input>
            <br/>
            <label>Name:</label>
            <br/>
            <input type="text" className='form-control' name="Name" onChange={handleChange} value={selectedProperty && selectedProperty.Name}></input>
            <br/>
            <label>Last Name:</label>
            <br/>
            <input type="text" className='form-control' name="Lastname" onChange={handleChange} value={selectedProperty && selectedProperty.Lastname}></input>
            <br/>
            <label>Location:</label>
            <br/>
            <input type="text" className='form-control' name="Location" onChange={handleChange} value={selectedProperty && selectedProperty.Location}></input>
            <br/>
            <label>Phone:</label>
            <br/>
            <input type="text" className='form-control' name="Phone" onChange={handleChange} value={selectedProperty && selectedProperty.Phone}></input>
            <br/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary'onClick={() => peticionPut}>Update</button>{"  "}
          <button className='btn btn-danger' onClick={() => openCloseInsertModal()}>Cancel</button>{"  "}
        </ModalFooter>
      </Modal>


      <Modal isOpen={deleteModal}>
        <ModalBody>
          ¿Are you sure you want to delete this User {selectedProperty && selectedProperty.Phone}?
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-danger' onClick={() => peticionDelete()}>
            Yes
          </button>
          <button className='btn btn-secondary' onClick={openCloseDeleteModal}>
            No
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
