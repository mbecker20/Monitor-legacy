import { Button, Card, Intent } from '@blueprintjs/core'
import { githubLogin } from '../../index'
import { classNames } from '../../helpers/general'
import './Login.css'

function Login() {
  // const [username, setUsername] = useState('')
  // const [password, setPassword] = useState('')
  // const [showPassword, setShowPassword] = useState(false)
  // const [loginLoading, setLoginLoading] = useState(false)
  // const usernameRef = useRef<HTMLInputElement>(null)
  // const doLogin = async () => {
  //   setLoginLoading(true)
  //   try {
  //     await localLogin(username, password)
  //     reInitialize().then(() => { })
  //   } catch (error) {
  //     if (setLoginLoading) setLoginLoading(false)
  //     if (usernameRef && usernameRef.current) usernameRef.current.focus()
  //   }
  // }
  return (
    <Card className={classNames('bp3-dark', 'Login')} elevation={2}>
      <div className='FlexCol'>
        <img className='Logo' src='/logo/logo.png' alt='EthDev Technologies' />
        <div>Monitor</div>
      </div>
      <Button
        onClick={githubLogin}
        intent={Intent.PRIMARY}
        rightIcon={
          <img src='/svg/github-logo.svg' alt='Github' width='25rem'/>
        }
        large
      >
        Login with Github
      </Button>
      {/* <div className='FlexRow' style={{ margin: '.75rem' }}>
        <Divider className='bp3-dark' style={{ width: '6rem', borderRightStyle: 'none', transform: 'translate(0, -20%)', marginRight: '.70rem' }} />
        or
        <Divider className='bp3-dark' style={{ width: '6rem', borderRightStyle: 'none', transform: 'translate(0, -20%)', marginLeft: '.70rem' }} />
      </div>
      <InputGroup 
        className='bp3-dark'
        placeholder='username'
        value={username}
        onChange={e => setUsername(e.target.value)}
        rightElement={
          <Button
            className='UserIcon'
            icon='user'
            intent={Intent.WARNING}
            minimal={true}
          />
        }
        style={{ marginBottom: '1rem' }}
        inputRef={usernameRef}
        large
      />
      <InputGroup 
        className='bp3-dark'
        placeholder='password'
        value={password}
        type={showPassword ? 'text' : 'password'}
        onChange={e => setPassword(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') doLogin() }}
        rightElement={
          <Tooltip2 content={`${showPassword ? "Hide" : "Show"} Password`} placement='right'>
            <Button
              icon={showPassword ? 'unlock' : 'lock'}
              intent={Intent.WARNING}
              minimal={true}
              onClick={() => setShowPassword(!showPassword)}
            />
          </Tooltip2>
        }
        style={{ marginBottom: '1rem' }}
        large
      />
      <Button
        onClick={doLogin}
        intent={Intent.SUCCESS}
        rightIcon={loginLoading ? undefined : 'log-in'}
      >
        {loginLoading ? <Spinner size={SpinnerSize.SMALL} /> : 'Login'}
      </Button> */}
    </Card>
  )
}

export default Login