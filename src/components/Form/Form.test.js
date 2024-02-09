import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FormValidation from './Form';
import { validateAge, validateEmail, validateNom, validatePostalCode, validatePrenom, saveInLocalStorage, isFormDataCompleted } from './Form';

describe('Form component', () => {

    it('Rendu de chaque composants du formulaire sans erreurs', () => {
        const { getByLabelText } = render(<FormValidation />);
        const nomInput = getByLabelText('Nom:');
        const prenomInput = getByLabelText('Prénom:');
        const dateNaissanceInput = getByLabelText('Date de naissance:');
        const codePostalInput = getByLabelText('Code Postal:');
        const villeInput = getByLabelText('Ville:');
        const emailInput = getByLabelText('Email:');
        
        expect(nomInput).toBeInTheDocument();
        expect(prenomInput).toBeInTheDocument();
        expect(dateNaissanceInput).toBeInTheDocument();
        expect(codePostalInput).toBeInTheDocument();
        expect(villeInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
    });

    describe("Test de l'affichage du toast", () => {
        it("Toast d'erreur", () => {
            const { getByText, getByLabelText } = render(<FormValidation/>)

            const nomInput = getByLabelText('Nom:');
            fireEvent.change(nomInput, { target: { value: 'Doe' } });

            const prenomInput = getByLabelText('Prénom:');
            fireEvent.change(prenomInput, { target: { value: 'Jane' } });

            const dateNaissanceInput = getByLabelText('Date de naissance:');
            fireEvent.change(dateNaissanceInput, { target: { value: '2000-01-01' } });

            const codePostalInput = getByLabelText('Code Postal:');
            fireEvent.change(codePostalInput, { target: { value: '06300' } });

            const villeInput = getByLabelText('Ville:');
            fireEvent.change(villeInput, { target: { value: 'Nice' } });

            const emailInput = getByLabelText('Email:');
            fireEvent.change(emailInput, { target: { value: 'mauvais.email' } });

            const button = screen.getByRole('button')

            fireEvent.click(button)

            const validationText = getByText("Error(s) while saving data")
            expect(validationText).toBeInTheDocument()
        })

        it("Toast de validation", () => {
            const { getByText, getByLabelText } = render(<FormValidation/>)

            const nomInput = getByLabelText('Nom:');
            fireEvent.change(nomInput, { target: { value: 'Doe' } });

            const prenomInput = getByLabelText('Prénom:');
            fireEvent.change(prenomInput, { target: { value: 'Jane' } });

            const dateNaissanceInput = getByLabelText('Date de naissance:');
            fireEvent.change(dateNaissanceInput, { target: { value: '2000-01-01' } });

            const codePostalInput = getByLabelText('Code Postal:');
            fireEvent.change(codePostalInput, { target: { value: '06300' } });

            const villeInput = getByLabelText('Ville:');
            fireEvent.change(villeInput, { target: { value: 'Nice' } });

            const emailInput = getByLabelText('Email:');
            fireEvent.change(emailInput, { target: { value: 'steve.strazzeri@ynov.com' } });

            const button = screen.getByRole('button')
            fireEvent.click(button)

            const validationText = getByText("Data saved !")
            expect(validationText).toBeInTheDocument()
        })

        it('Test de la fermeture de la snackbar', () => {
            const { getByText, getByLabelText } = render(<FormValidation/>)

            const nomInput = getByLabelText('Nom:');
            fireEvent.change(nomInput, { target: { value: 'Doe' } });

            const prenomInput = getByLabelText('Prénom:');
            fireEvent.change(prenomInput, { target: { value: 'Jane' } });

            const dateNaissanceInput = getByLabelText('Date de naissance:');
            fireEvent.change(dateNaissanceInput, { target: { value: '2000-01-01' } });

            const codePostalInput = getByLabelText('Code Postal:');
            fireEvent.change(codePostalInput, { target: { value: '06300' } });

            const villeInput = getByLabelText('Ville:');
            fireEvent.change(villeInput, { target: { value: 'Nice' } });

            const emailInput = getByLabelText('Email:');
            fireEvent.change(emailInput, { target: { value: 'steve.strazzeri@ynov.com' } });

            const button = screen.getByRole('button')
            fireEvent.click(button)

            let validationText = getByText("Data saved !")
            expect(validationText).toBeInTheDocument()

            const snackbarButton = screen.getByTestId("closeSnackbarBtn")
            fireEvent.click(snackbarButton)

            validationText = screen.queryByText("Data saved !")
            expect(validationText).toBeNull()
        })
    })

    describe('Ecriture des inputs', () => {
        it('Mise à jour input nom', async () => {
            const { getByLabelText } = render(<FormValidation />);
            const nomInput = getByLabelText('Nom:');
            fireEvent.change(nomInput, { target: { value: 'Doe' } });
            expect(nomInput.value).toBe('Doe');
        });

        it('Mise à jour input prenom', async () => {
            const { getByLabelText } = render(<FormValidation />);
            const prenomInput = getByLabelText('Prénom:');
            fireEvent.change(prenomInput, { target: { value: 'Jane' } });
            expect(prenomInput.value).toBe('Jane');
        });

        it('Mise à jour input age', async () => {
            const { getByLabelText } = render(<FormValidation />);
            const dateNaissanceInput = getByLabelText('Date de naissance:');
            fireEvent.change(dateNaissanceInput, { target: { value: '2000-01-01' } });
            expect(dateNaissanceInput.value).toBe('2000-01-01');
        });

        it('Mise à jour input code postal', async () => {
            const { getByLabelText } = render(<FormValidation />);
            const codePostalInput = getByLabelText('Code Postal:');
            fireEvent.change(codePostalInput, { target: { value: '06300' } });
            expect(codePostalInput.value).toBe('06300');
        });

        it('Mise à jour input ville', async () => {
            const { getByLabelText } = render(<FormValidation />);
            const villeInput = getByLabelText('Ville:');
            fireEvent.change(villeInput, { target: { value: 'Nice' } });
            expect(villeInput.value).toBe('Nice');
        });

        it('Mise à jour input email', async () => {
            const { getByLabelText } = render(<FormValidation />);
            const emailInput = getByLabelText('Email:');
            fireEvent.change(emailInput, { target: { value: 'steve.strazzeri@ynov.com' } });
            expect(emailInput.value).toBe('steve.strazzeri@ynov.com');
        });
    })

    describe('Test unitaire des fonctions externes', () => {
        describe('Fonction validateNom', () => {
            it('Devrait retourner true', async () => {
                //PREPARE
                const nom = "Strazzeri"
                //ACT
                const result = validateNom(nom)
                //ASSERT
                expect(result).toBeTruthy()
            });

            it('Devrait retourner false', async () => {
                //PREPARE
                const nom = "Strazzeri@"
                //ACT
                const result = validateNom(nom)
                //ASSERT
                expect(result).toBeFalsy()
            });
        })

        describe('Fonction validatePrenom', () => {
            it('Devrait retourner true', async () => {
                //PREPARE
                const prenom = "Steve"
                //ACT
                const result = validateNom(prenom)
                //ASSERT
                expect(result).toBeTruthy()
            });

            it('Devrait retourner false', async () => {
                //PREPARE
                const prenom = "Strazzeri@"
                //ACT
                const result = validatePrenom(prenom)
                //ASSERT
                expect(result).toBeFalsy()
            });
        })

        describe('Fonction validateAge', () => {
            it('Devrait retourner true', async () => {
                //PREPARE
                const age = 23
                //ACT
                const result = validateAge(age)
                //ASSERT
                expect(result).toBeTruthy()
            });

            it('Devrait retourner false', async () => {
                //PREPARE
                const age = 10
                //ACT
                const result = validateAge(age)
                //ASSERT
                expect(result).toBeFalsy()
            });
        })

        describe('Fonction validatePostalCode', () => {
            it('Devrait retourner true', async () => {
                //PREPARE
                const postalCode = "06300"
                //ACT
                const result = validatePostalCode(postalCode)
                //ASSERT
                expect(result).toBeTruthy()
            });

            it('Devrait retourner false', async () => {
                //PREPARE
                const postalCode = "061"
                //ACT
                const result = validatePostalCode(postalCode)
                //ASSERT
                expect(result).toBeFalsy()
            });
        })

        describe('Fonction validateEmail', () => {
            it('Devrait retourner true', async () => {
                //PREPARE
                const email = "steve.strazzeri@ynov.com"
                //ACT
                const result = validateEmail(email)
                //ASSERT
                expect(result).toBeTruthy()
            });

            it('Devrait retourner false', async () => {
                //PREPARE
                const email = "steve.strazzerinov.com"
                //ACT
                const result = validateEmail(email)
                //ASSERT
                expect(result).toBeFalsy()
            });
        })

        describe('Fonction isFormDataCompleted', () => {
            it('Devrait retourner true', async () => {
                //PREPARE
                const formData = {
                    nom: 'Strazzeri',
                    prenom: 'Steve',
                    dateNaissance: '2000-31-10',
                    codePostal: '06300',
                    ville: 'Nice',
                    email: 'steve.strazzeri@ynov.com',
                }
                //ACT
                const result = isFormDataCompleted(formData)
                //ASSERT
                expect(result).toBeTruthy()
            });

            it('Devrait retourner false', async () => {
                //PREPARE
                const formData = {
                    nom: 'Strazzeri',
                    prenom: 'Steve',
                    dateNaissance: '2000-31-10',
                    codePostal: '06300',
                    ville: '',
                    email: 'steve.strazzeri@ynov.com',
                }
                //ACT
                const result = isFormDataCompleted(formData)
                //ASSERT
                expect(result).toBeFalsy()
            });
        })

        it('Sauvagarde dans le local storage', () => {
            //PREPARE
            const formData = {
                nom: 'Strazzeri',
                prenom: 'Steve',
                dateNaissance: '2000-31-10',
                codePostal: '06300',
                ville: 'Nice',
                email: 'steve.strazzeri@ynov.com',
            }
            //ACT
            saveInLocalStorage(formData)
            const savedFormData = JSON.parse(localStorage.getItem("form"))
            //ASERT
            expect(savedFormData).toMatchObject(formData)
        })
    })

    describe("Test des messages d'erreur pour chaque champs", () => {

        beforeEach(() => {
            const { getByLabelText } = render(<FormValidation/>)

            const nomInput = getByLabelText('Nom:');
            fireEvent.change(nomInput, { target: { value: 'Doe&' } });
    
            const prenomInput = getByLabelText('Prénom:');
            fireEvent.change(prenomInput, { target: { value: 'Jane@' } });
    
            const dateNaissanceInput = getByLabelText('Date de naissance:');
            fireEvent.change(dateNaissanceInput, { target: { value: '2018-01-01' } });
    
            const codePostalInput = getByLabelText('Code Postal:');
            fireEvent.change(codePostalInput, { target: { value: '0630a' } });
    
            const villeInput = getByLabelText('Ville:');
            fireEvent.change(villeInput, { target: { value: 'Nice' } });
    
            const emailInput = getByLabelText('Email:');
            fireEvent.change(emailInput, { target: { value: 'mauvais.email' } });

            const button = screen.getByRole('button')
            fireEvent.click(button)
        })

        it('Champ du nom', () => {
            const { getByText } = render(<FormValidation/>)
            const errorText = getByText("Le nom est invalide.")
            expect(errorText).toBeInTheDocument()
        })

        it('Champ du prénom', () => {
            const { getByText } = render(<FormValidation/>)
            const errorText = getByText("Le prénom est invalide.")
            expect(errorText).toBeInTheDocument()
        })

        it('Champ de la date de naissance', () => {
            const { getByText } = render(<FormValidation/>)
            const errorText = getByText("Vous devez être majeur.")
            expect(errorText).toBeInTheDocument()
        })

        it('Champ du code postal', () => {
            const { getByText } = render(<FormValidation/>)
            const errorText = getByText("Le code postal est invalide.")
            expect(errorText).toBeInTheDocument()
        })

        it("Champ de l'email", () => {
            const { getByText } = render(<FormValidation/>)
            const errorText = getByText("L\'email est invalide.")
            expect(errorText).toBeInTheDocument()
        })
    })

    describe("Test accessibilité du bouton 'soumettre'",() => {
        it("Le bouton devrait être accessible", () => {
            const { getByLabelText } = render(<FormValidation/>)

            const nomInput = getByLabelText('Nom:');
            fireEvent.change(nomInput, { target: { value: 'Doe' } });

            const prenomInput = getByLabelText('Prénom:');
            fireEvent.change(prenomInput, { target: { value: 'Jane' } });

            const dateNaissanceInput = getByLabelText('Date de naissance:');
            fireEvent.change(dateNaissanceInput, { target: { value: '2000-01-01' } });

            const codePostalInput = getByLabelText('Code Postal:');
            fireEvent.change(codePostalInput, { target: { value: '06300' } });

            const villeInput = getByLabelText('Ville:');
            fireEvent.change(villeInput, { target: { value: 'Nice' } });

            const emailInput = getByLabelText('Email:');
            fireEvent.change(emailInput, { target: { value: 'steve.strazzeri@ynov.com' } });

            const button = screen.getByRole('button')
            expect(button).not.toBeDisabled()
        })

        it("Le bouton ne devrait pas être accessible", () => {
            const { getByLabelText } = render(<FormValidation/>)

            const nomInput = getByLabelText('Nom:');
            fireEvent.change(nomInput, { target: { value: 'Doe' } });

            const prenomInput = getByLabelText('Prénom:');
            fireEvent.change(prenomInput, { target: { value: '' } });

            const dateNaissanceInput = getByLabelText('Date de naissance:');
            fireEvent.change(dateNaissanceInput, { target: { value: '2000-01-01' } });

            const codePostalInput = getByLabelText('Code Postal:');
            fireEvent.change(codePostalInput, { target: { value: '06300' } });

            const villeInput = getByLabelText('Ville:');
            fireEvent.change(villeInput, { target: { value: 'Nice' } });

            const emailInput = getByLabelText('Email:');
            fireEvent.change(emailInput, { target: { value: 'steve.strazzeri@ynov.com' } });

            const button = screen.getByRole('button')
            expect(button).toBeDisabled()
        })
    })
});