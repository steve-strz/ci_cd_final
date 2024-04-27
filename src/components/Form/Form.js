import React, { useState, useEffect } from 'react';
import { Snackbar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import './Form.css'
import ReactDOM from 'react-dom';




/** Regex rules for firstname and lastname */
const regexNomPrenom = /^[a-zA-ZÀ-ÿ\-']+$/;
/** Regex rules for the postal code */
const regexCodePostal = /^\d{5}$/;
/** Regex rules for email */
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Function that validate firstname input
 * @param {string} nom Firstname input
 * @return {boolean} true or false
*/
export function validateNom(nom){
  return regexNomPrenom.test(nom)
}

/**
 * Function that validate lastname input
 * @param {string} prenom Lastname input
 * @return {boolean} true or false
*/
export function validatePrenom(prenom){
  return regexNomPrenom.test(prenom)
}

/**
 * Function that validate age input, must be older than 18 years old
 * @param {string} age Birthdate input
 * @return {boolean} true or false
*/
export function validateAge(age){
  return age >= 18
}

/**
 * Function that validate postal code input
 * @param {string} postalCode Postal code input
 * @return {boolean} true or false
*/
export function validatePostalCode(postalCode){
  return regexCodePostal.test(postalCode)
}

/**
 * Function that validate email input
 * @param {string} email Email input
 * @return {boolean} true or false
*/
export function validateEmail(email){
  return regexEmail.test(email)
}

/**
 * Function that saves form data in local storage
 * @param {object} data Form data
 * @return {boolean} true or false
*/
export async function saveInLocalStorage(data){
  localStorage.setItem("form", JSON.stringify(data))

  try {
    const response = await fetch('http://localhost/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      console.log('user was create');
    } else {
      console.error('Error : user was not create');
    }
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

/**
 * Function that check if form data is completly filled 
 * @param {object} data Form data
 * @return {boolean} true or false
*/
export function isFormDataCompleted(data){
  for (const key in data) {
    if (data[key] === '')return false;
  }
  return true;
}

/** Form react component */
const FormValidation = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    codePostal: '',
    ville: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [msgSnackbar, setMsgSnackbar] = React.useState("");
  const [formValid, setFormValid] = useState(false);
  const [showList, setShowList] = useState(false);
  const [isExiste, setIsExiste] = useState(false);

  useEffect(() => {
    setIsExiste(true);
    setFormValid(isFormDataCompleted(formData))
    return () => setIsExiste(false);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const getUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users/'); 
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error :', error);
    }
  };

  const displayListUser = async () => {
    const users = await getUsers();

    if (isExiste) { 
      if (users && users.length > 0) {
        const tableRows = users.map(user => (
          <tr key={user.id}>
            <td>{user.lastName}</td>
            <td>{user.firstName}</td>
            <td>{user.birthDate}</td>
            <td>{user.postalCode}</td>
            <td>{user.city}</td>
            <td>{user.email}</td>
          </tr>
        ));

        ReactDOM.render(
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Date de naissance</th>
                <th>Code postal</th>
                <th>Ville</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
          </table>,
          document.getElementById('listUser') 
        );
      } else {
        ReactDOM.render(
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Date de naissance</th>
                <th>Code postal</th>
                <th>Ville</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6">Aucun utilisateur</td>
              </tr>
            </tbody>
          </table>,
          document.getElementById('listUser') 
        );
      }
    }
  };

  const handleLists = (e) => {
    setShowList(showList ? false : displayListUser() && true);
  };

  const handleCloseSnackbar = (event, reason) => {
    setOpenSnackbar(false)
    setMsgSnackbar("")
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    const dateNaissance = new Date(formData.dateNaissance);
    const today = new Date();
    const age = today.getFullYear() - dateNaissance.getFullYear();

    if (!validateNom(formData.nom)) {
      errors.nom = 'Le nom est invalide.';
    }
    if (!validateNom(formData.prenom)) {
      errors.prenom = 'Le prénom est invalide.';
    }
    if (!validateAge(age)) {
      errors.dateNaissance = 'Vous devez être majeur.';
    }
    if (!validatePostalCode(formData.codePostal)) {
      errors.codePostal = 'Le code postal est invalide.';
    }
    if (!validateEmail(formData.email)) {
      errors.email = 'L\'email est invalide.';
    }

    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      setMsgSnackbar("Data saved !")
      saveInLocalStorage(formData)
    } else setMsgSnackbar("Error(s) while saving data")

    setOpenSnackbar(true)
  };

  const action = (
    <React.Fragment>
      <IconButton
        data-testid='closeSnackbarBtn'
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div className="container">
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nom">Nom:</label>
        <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} />
        {errors.nom && <span style={{ color: 'red' }}>{errors.nom}</span>}
      </div>
      <div>
        <label htmlFor="prenom">Prénom:</label>
        <input type="text" id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} />
        {errors.prenom && <span style={{ color: 'red' }}>{errors.prenom}</span>}
      </div>
      <div>
        <label htmlFor="dateNaissance">Date de naissance:</label>
        <input type="date" id="dateNaissance" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} />
        {errors.dateNaissance && <span style={{ color: 'red' }}>{errors.dateNaissance}</span>}
      </div>
      <div>
        <label htmlFor="codePostal">Code Postal:</label>
        <input type="text" id="codePostal" name="codePostal" value={formData.codePostal} onChange={handleChange} />
        {errors.codePostal && <span style={{ color: 'red' }}>{errors.codePostal}</span>}
      </div>
      <div>
        <label htmlFor="ville">Ville:</label>
        <input type="text" id="ville" name="ville" value={formData.ville} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      </div>
      <button disabled={!formValid} type="submit">Soumettre</button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={msgSnackbar}
        action={action}
        ContentProps={{
          style: {
            color: 'white',
            backgroundColor: Object.keys(errors).length === 0 ? 'green' : 'red'
          }
        }}
      />
    </form>
    <button onClick={handleLists}>List user</button>
    <div id="listUser"> {/* Element with ID "listUser" */}
        {showList}
      </div>
    </div>
  );
};

export default FormValidation;
