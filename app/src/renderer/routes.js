export default [
  {
    path: '/',
    name: 'Home',
    component: require('components/Home')
  },
  {
    path: '*',
    redirect: '/'
  }
]
