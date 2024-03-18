import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { MailIcon, LockClosedIcon, UserIcon, PhoneIcon } from "@heroicons/react/solid";

import { setDoc, doc } from "firebase/firestore";

import { Link, useNavigate } from "react-router-dom";


const SignUp = () => {
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm({ mode: "onBlur" });

  const validatePassword = (value) => {
    // Vérifier la longueur minimale
    if (value.length < 8) return false;
    
    // Vérifier la présence de majuscules, minuscules, chiffres et caractères spéciaux
    const containsLowerCase = /[a-z]/.test(value);
    const containsUpperCase = /[A-Z]/.test(value);
    const containsNumber = /\d/.test(value);
    const containsSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    
    return containsLowerCase && containsUpperCase && containsNumber && containsSpecialChar;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;
      alert(`Welcome ${user.email}`);
      const userRef = doc(db, "users", user.uid);

      await setDoc(userRef, {
        name: data.name,
        firstName: data.firstName,
        email: data.email,
        phone: data.phone,
      });

      setLoading(false);
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.message}`);
      setLoading(false);
    }
  };
  
  return (
    <div className="sign-up-page">
      <div className="sign-up-form max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-center text-blue-500 mb-8 connexion">
          Inscription
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col mb-4">
            <label htmlFor="name" className="text-gray-700 font-medium mb-2">
              Nom
            </label>
            <div className="flex items-center border border-gray-300 px-3 py-2 my-arrondi focus-within:ring-2 focus-within:ring-blue-500">
              <UserIcon className="text-gray-500 mr-2 h-5 w-5" />
              <input
                type="text"
                id="name"
                {...register("name", { required: true, maxLength: 20 })}
                className="flex-1 focus:outline-none"
              />
            </div>
            {errors.name && (
              <span className="text-red-500 text-sm">
                Nom requis (max 20 caractères)
              </span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="firstName" className="text-gray-700 font-medium mb-2">
              Prénom
            </label>
            <div className="flex items-center border border-gray-300 px-3 py-2 my-arrondi focus-within:ring-2 focus-within:ring-blue-500">
              <UserIcon className="text-gray-500 mr-2 h-5 w-5" />
              <input
                type="text"
                id="firstName"
                {...register("firstName", { required: true, maxLength: 20 })}
                className="flex-1 focus:outline-none"
              />
            </div>
            {errors.firstName && (
              <span className="text-red-500 text-sm">
                Prénom requis (max 20 caractères)
              </span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="email" className="text-gray-700 font-medium mb-2">
              Email
            </label>
            <div className="flex items-center border border-gray-300 px-3 py-2 my-arrondi focus-within:ring-2 focus-within:ring-blue-500">
              <MailIcon className="text-gray-500 mr-2 h-5 w-5" />
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
                className="flex-1 focus:outline-none"
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-sm">Email invalide</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="phone" className="text-gray-700 font-medium mb-2">
              Téléphone
            </label>
            <div className="flex items-center border border-gray-300 px-3 py-2 my-arrondi focus-within:ring-2 focus-within:ring-blue-500">
              <PhoneIcon className="text-gray-500 mr-2 h-5 w-5" />
              <input
                type="tel"
                id="phone"
                {...register("phone", {
                  required: true,
                  pattern: /^(\+33|0)[1-9]\d{8}$/,
                })}
                className="flex-1 focus:outline-none"
              />
            </div>
            {errors.phone && (
              <span className="text-red-500 text-sm">
                Numéro de téléphone invalide
              </span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="password" className="text-gray-700 font-medium mb-2">
              Mot de passe
            </label>
            <div className="flex items-center border border-gray-300 px-3 py-2 my-arrondi focus-within:ring-2 focus-within:ring-blue-500">
              <LockClosedIcon className="text-gray-500 mr-2 h-5 w-5" />
              <input
                type="password"
                id="password"
                {...register("password", { required: true, validate: validatePassword})}
                className="flex-1 focus:outline-none"
              />
            </div>
            {errors.password && (
            <div className="text-red-500 text-sm text-left">
              <p>Le mot de passe est trop simple. Il doit respecter les critères suivants :</p>
              <ul>
                {[
                  { criterion: /[a-z]/, message: "Contenir au moins une lettre minuscule" },
                  { criterion: /[A-Z]/, message: "Contenir au moins une lettre majuscule" },
                  { criterion: /\d/, message: "Contenir au moins un chiffre" },
                  { criterion: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, message: "Contenir au moins un caractère spécial" },
                  { criterion: value => value.length >= 8, message: "Avoir une longueur minimale de 8 caractères" }
                    ].map(({ criterion, message }, index) => (
                    <li key={index}>{typeof criterion === "function" ? !criterion(watch("password")) && message : !criterion.test(watch("password")) && message}</li>
      ))}
    </ul>
  </div>
            )}
            <div className="flex items-center mt-2">
              <span className="text-sm">
                {passwordStrength === 0
                  ? "Très faible"
                  : passwordStrength === 1
                  ? "Faible"
                  : passwordStrength === 2
                  ? "Moyen"
                  : passwordStrength === 3
                  ? "Fort"
                  : "Très fort"}
              </span>
            </div>
          </div>
          {/* Confirmation du mot de passe */}
          <div className="flex flex-col mb-4">
            <label htmlFor="confirmPassword" className="text-gray-700 font-medium mb-2">
              Confirmer le mot de passe
            </label>
            <div className="flex items-center border border-gray-300 px-3 py-2 my-arrondi focus-within:ring-2 focus-within:ring-blue-500">
              <LockClosedIcon className="text-gray-500 mr-2 h-5 w-5" />
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword", {
                  required: true,
                  validate: (value) => value === watch("password"),
                })}
                className="flex-1 focus:outline-none"
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                Les mots de passe ne correspondent pas
              </span>
            )}
          </div>
          {/* Autres champs du formulaire */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="terms"
              {...register("terms", { required: true })}
              className="border border-gray-300 rounded mr-2 focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-gray-700 font-medium">
              J'accepte 
              {/* <Link to = "/condition"> les termes et conditions
              </Link> */}
            </label>
          </div>
          {errors.terms && (
            <span className="text-red-500 text-sm">
              
              Vous devez accepter les termes et conditions
            </span>
          )}
          <div className="flex justify-center">
            <button
              type="submit"
              className=" text-white font-bold py-2 px-4 my-arrondi disabled:opacity-50 my-connexbtn"
              disabled={loading}
            >
              S'inscrire
            </button>
          </div>
          <div className="flex justify-center mt-4">
            {/* <Link to="/" className="text-blue-500 text-sm">
              Déjà un compte ? Connectez-vous ici
            </Link> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;