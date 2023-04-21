import { AuthenticationError, PromiseReturnType } from "blitz"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "src/core/components/Form"
import login from "src/auth/mutations/login"
import { Login } from "src/auth/validations"
import { useMutation } from "@blitzjs/rpc"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)
  return (
    <Form
      submitText="Login"
      schema={Login}
      initialValues={{ email: "", password: "" }}
      onSubmit={async (values) => {
        try {
          const user = await loginMutation(values)
          props.onSuccess?.(user)
        } catch (error: any) {
          if (error instanceof AuthenticationError) {
            return { [FORM_ERROR]: "Sorry, die gegevens zijn incorrect..." }
          } else {
            return {
              [FORM_ERROR]:
                "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
            }
          }
        }
      }}
    >
      <LabeledTextField name="email" label="E-mail" placeholder="E-mail" />
      <LabeledTextField
        name="password"
        label="Wachtwoord"
        placeholder="Wachtwoord"
        type="password"
      />
    </Form>
  )
}

export default LoginForm
