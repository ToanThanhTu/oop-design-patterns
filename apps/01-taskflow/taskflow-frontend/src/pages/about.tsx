export async function clientLoader() {
  // fetch data here
  return {
    title: 'About page',
  }
}

export default function Component({ loaderData }) {
  return <h1>{loaderData.title}</h1>
}
