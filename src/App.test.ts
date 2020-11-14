import Counter from './App.svelte'
import { render } from '@testing-library/svelte'

it('it works', async () => {
  const { getByText } = render(Counter)

  const helloWorld = getByText('Hello world!')

  // with jest-dom
  expect(helloWorld).toBeDefined()
})