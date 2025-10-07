export async function catchError(promise: Promise<any>): Promise<[any, any]> {
  try {
    let data = await promise;
    return [data, null];
  } catch (error) {
    console.error('Error capturado en catchError:', error);
    return [null, error];
  }
}
