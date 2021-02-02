import React, { useState, useRef } from 'react';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import md5 from 'md5';

function RegisterPage() {

  const { register, watch, errors, handleSubmit } = useForm({ mode: "onChange" });
  const [ errorFromSubmit, setErrorFromSubmit ] = useState("");
  const [ loading, setLoading ] = useState(false);

  const password = useRef();
  password.current = watch("password");

  const onSubmit = async (data) => {

    // data = {
    //   email: "test@test.com"
    //   name: "이수연"
    //   password: "123456"
    //   password_confirm: "123456"
    // }

    try {
      setLoading(true);
      // firebase에서 이메일과 비밀번호로 유저 생성
      let createdUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password);
      
      // firebase에서 생성한 유저에 추가 정보 입력
      await createdUser.user
        .updateProfile({
          displayName: data.name,
          photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
        })
        console.log("createdUser", createdUser);

      // firebase 데이터 베이스에 저장해주기
      await firebase.database().ref("users").child(createdUser.user.uid).set({
        name: createdUser.user.displayName,
        image: createdUser.user.photoURL
      })
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
        <h3>Register</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
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

          {errorFromSubmit && 
            <p>{errorFromSubmit}</p>
          }

        <button type="submit" disabled={loading}>SUBMIT</button>
      </form>
      <div className="link">
        <Link className="login_link" to="/">홈화면</Link>
        <Link className="login_link" to="/login">로그인하기</Link>
      </div>
    </div>
  )
}

export default RegisterPage
