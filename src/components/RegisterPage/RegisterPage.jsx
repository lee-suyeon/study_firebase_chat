import React, { useRef } from 'react';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';

function RegisterPage() {

  const { register, watch, errors } = useForm({ mode: "onChange" });
  const password = useRef();
  password.current = watch("password");

  return (
    <div className="auth-wrapper">
      <div className="register-title">
        <h3>Register</h3>
      </div>
      <form onSubmit>
        <label>E-mail</label>
        <input 
          name="email" 
          type="email" 
          ref={register({ required: true, pattern: /^\S+@\S+$/i })} />
        {errors.email && <p>이메일을 입력해주세요. </p>}

        <label>Name</label>
        <input
          name="name"
          type="text"
          ref={register({ required: true, maxLength: 10 })}
        />
        {errors.name && errors.name.type === "required"
          && <p>이름을 입력해주세요.</p>}
        {errors.name && errors.name.type === "maxLength"
          && <p>이름을 10자 이내로 입력해주세요.</p>}

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

        <label>Password Confirm</label>
        <input
          name="password_confirm"
          type="password"
          ref={register({ 
            required: true,  
            validate: (value) => 
              value === password.current
          })}
        />
        {errors.password_confirm && errors.password_confirm.type === "required"
          && <p>패스워드를 입력해주세요.</p>}  {/* This password field is required */}
        {errors.password_confirm && errors.password_confirm.type === "validate"
          && <p>패스워드가 같지 않습니다. </p>}  {/* The password don't match */}

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
