export default async function test() {
  const obj: Record<string, any> = {}
  const res = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(666)
    }, 1000)
  })

  obj.a = res
  console.log(res)
  return obj
}
