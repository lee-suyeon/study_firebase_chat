import React from 'react';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';

function RegisterPage() {

  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = data => {
    console.log(data);
  };

  return (
    <div className="auth-wrapper">
      <div className="register-title">
        <h3>Register</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>E-mail</label>
        <input 
          name="email" 
          type="email" 
          defaultValue="test"
          ref={register} />
        <label>Name</label>
        <input
          name="name"
          type="text"
          ref={register({ required: true, maxLength: 10 })}
        />
        <label>Password</label>
        <input
          name="password"
          type="password"
          ref={register({ required: true, maxLength: 10 })}
        />
        <label>Password Confirm</label>
        <input
          name="password_confirm"
          type="password"
          ref={register({ required: true, maxLength: 10 })}
        />
        {errors.exampleRequired && <p>This field is required</p>}
        <button type="submit">SUBMIT</button>
      </form>
      <div className="link">
        <Link className="login_link" to="/">홈화면</Link>
        <Link className="login_link" to="/login">로그인하기</Link>
      </div>
    </div>
  )
}

export default RegisterPage
