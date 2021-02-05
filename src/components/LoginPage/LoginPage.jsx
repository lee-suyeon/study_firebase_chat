import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import firebase from '../../firebase';

function LoginPage() {

  const { register, errors, handleSubmit } = useForm({ mode: "onChange" });
  const [ errorFromSubmit, setErrorFromSubmit ] = useState("");
  const [ loading, setLoading ] = useState(false);

  const onSubmit = async (data) => {

    try {
      setLoading(true);

      await firebase.auth().signInWithEmailAndPassword(data.email, data.password);
      
      setLoading(false);
    } catch (error) {
        setErrorFromSubmit(error.message);
        setLoading(false);
      setTimeout(() => {
        setErrorFromSubmit("");
      }, 5000)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="register-title">
        <h3>Login</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>E-mail</label>
        <input 
          name="email" 
          type="email" 
          ref={register({ required: true, pattern: /^\S+@\S+$/i })} />
        {errors.email && <p>이메일을 입력해주세요. </p>}

        <label>Password</label>
        <input
          name="password"
          type="password"
          ref={register({ required: true, minLength: 6 })}
        />
        {errors.password && errors.password.type === "required"
          && <p>패스워드를 입력해주세요.</p>}  {/* This password field is required */}
        {errors.password && errors.password.type === "minLength"
          && <p>패스워드를 6자 이상으로 입력해주세요.</p>} {/* Password must have at least 6 characters*/}

          {errorFromSubmit && 
            <p>{errorFromSubmit}</p>
          }

        <button type="submit" disabled={loading}>SUBMIT</button>
      </form>
      <div className="link">
        <Link className="login_link" to="/">홈화면</Link>
        <Link className="login_link" to="/register">회원가입</Link>
      </div>
    </div>
  )
}

export default LoginPage
