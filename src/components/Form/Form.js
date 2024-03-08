import React, { useState, useEffect } from "react";
import { Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Link, Typography } from "@mui/material";

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
export function validateNom(nom) {
  return regexNomPrenom.test(nom);
}

/**
 * Function that validate lastname input
 * @param {string} prenom Lastname input
 * @return {boolean} true or false
 */
export function validatePrenom(prenom) {
  return regexNomPrenom.test(prenom);
}

/**
 * Function that validate age input, must be older than 18 years old
 * @param {string} age Birthdate input
 * @return {boolean} true or false
 */
export function validateAge(age) {
  return age >= 18;
}

/**
 * Function that validate postal code input
 * @param {string} postalCode Postal code input
 * @return {boolean} true or false
 */
export function validatePostalCode(postalCode) {
  return regexCodePostal.test(postalCode);
}

/**
 * Function that validate email input
 * @param {string} email Email input
 * @return {boolean} true or false
 */
export function validateEmail(email) {
  return regexEmail.test(email);
}

/**
 * Function that saves form data in local storage
 * @param {object} data Form data
 * @return {boolean} true or false
 */
export function saveInLocalStorage(data) {
  localStorage.setItem("form", JSON.stringify(data));
}

/**
 * Function that check if form data is completly filled
 * @param {object} data Form data
 * @return {boolean} true or false
 */
export function isFormDataCompleted(data) {
  for (const key in data) {
    if (data[key] === "") return false;
  }
  return true;
}

/** Form react component */
const FormValidation = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    codePostal: "",
    ville: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [msgSnackbar, setMsgSnackbar] = React.useState("");
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    setFormValid(isFormDataCompleted(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    setOpenSnackbar(false);
    setMsgSnackbar("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    const dateNaissance = new Date(formData.dateNaissance);
    const today = new Date();
    const age = today.getFullYear() - dateNaissance.getFullYear();

    if (!validateNom(formData.nom)) {
      errors.nom = "Le nom est invalide.";
    }
    if (!validateNom(formData.prenom)) {
      errors.prenom = "Le prénom est invalide.";
    }
    if (!validateAge(age)) {
      errors.dateNaissance = "Vous devez être majeur.";
    }
    if (!validatePostalCode(formData.codePostal)) {
      errors.codePostal = "Le code postal est invalide.";
    }
    if (!validateEmail(formData.email)) {
      errors.email = "L'email est invalide.";
    }

    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      setMsgSnackbar("Data saved !");
      saveInLocalStorage(formData);
    } else setMsgSnackbar("Error(s) while saving data");

    setOpenSnackbar(true);
  };

  const action = (
    <React.Fragment>
      <IconButton
        data-testid="closeSnackbarBtn"
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
    <>
      <Button>
        <Link
          to={`../UsersList/UserList`}
          style={{ textDecoration: "none", color: "inherit" }}>
          <Typography textAlign="center">Users list</Typography>
        </Link>
      </Button>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nom">Nom:</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
          />
          {errors.nom && <span style={{ color: "red" }}>{errors.nom}</span>}
        </div>
        <div>
          <label htmlFor="prenom">Prénom:</label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
          />
          {errors.prenom && (
            <span style={{ color: "red" }}>{errors.prenom}</span>
          )}
        </div>
        <div>
          <label htmlFor="dateNaissance">Date de naissance:</label>
          <input
            type="date"
            id="dateNaissance"
            name="dateNaissance"
            value={formData.dateNaissance}
            onChange={handleChange}
          />
          {errors.dateNaissance && (
            <span style={{ color: "red" }}>{errors.dateNaissance}</span>
          )}
        </div>
        <div>
          <label htmlFor="codePostal">Code Postal:</label>
          <input
            type="text"
            id="codePostal"
            name="codePostal"
            value={formData.codePostal}
            onChange={handleChange}
          />
          {errors.codePostal && (
            <span style={{ color: "red" }}>{errors.codePostal}</span>
          )}
        </div>
        <div>
          <label htmlFor="ville">Ville:</label>
          <input
            type="text"
            id="ville"
            name="ville"
            value={formData.ville}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
        </div>
        <button disabled={!formValid} type="submit">
          Soumettre
        </button>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={msgSnackbar}
          action={action}
          ContentProps={{
            style: {
              color: "white",
              backgroundColor:
                Object.keys(errors).length === 0 ? "green" : "red",
            },
          }}
        />
      </form>
    </>
  );
};

export default FormValidation;
