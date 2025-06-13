import "./Login.css";

function Login() {
    const googleAuth = () => {
        window.open(
            `${process.env.REACT_APP_API_URL}/auth/google/callback`,
            "_self"
        );
    };
    return (
		<div className='container'>
			<h1 className='heading'>Login into Charlie 2.0</h1>
			<div className='form_container'>
				<div className='right'>
					<h2 className='from_heading'>Enter with Google</h2>
					<button className='google_btn' onClick={googleAuth}>
						<img src="./images/google.png" alt="google icon" />
						<span>Sign in with Google</span>
					</button>
				</div>
			</div>
		</div>
    );
}

export default Login;