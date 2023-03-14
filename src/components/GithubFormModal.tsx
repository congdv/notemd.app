import { GithubService } from '@/service/GithubService'
import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { ShieldCheckIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid'

const GithubFormModal = ({
  setIsOpen,
  onSaveData,
}: {
  setIsOpen: (isOpen: boolean) => void
  onSaveData: (data: GithubFormData) => void
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<GithubFormData>()
  const [isSaving, setSaving] = useState(false)
  const [isValidToken, setValidToken] = useState(true)
  const onSubmit: SubmitHandler<GithubFormData> = async (data) => {
    setSaving(true)
    await onSaveData(data)
    setSaving(false)
  }

  const isValidGithubToken = async () => {
    try {
      const { email, login } = await GithubService.authenticated(getValues('accessToken'))
      localStorage.setItem('github-user', JSON.stringify({ email, login }))
      return true
    } catch (error) {
      return false
    }
  }

  const onCheckToken = async () => {
    setValidToken(await isValidGithubToken())
  }

  useEffect(() => {
    const savedGithubToken = localStorage.getItem('github-access-token')
    if (savedGithubToken && savedGithubToken.length > 0) {
      setValue('accessToken', savedGithubToken)
      setValidToken(true)
    } else {
      setValidToken(false)
    }
  }, [])

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 mx-auto w-1/3">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">Github</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setIsOpen(false)}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <form className="bg-white rounded px-8 pt-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block  text-sm font-bold mb-2" htmlFor="accessToken">
                  Github Access Token
                </label>

                <div className="relative text-gray-600 focus-within:text-gray-400">
                  <input
                    className="border rounded w-full py-2 px-3  "
                    id="accessToken"
                    type="text"
                    placeholder="Github Access Tokens"
                    {...register('accessToken', { required: true, validate: () => isValidToken })}
                  />
                  <span className="absolute inset-y-0 -right-0 flex items-center pl-2">
                    {isValidToken ? (
                      <ShieldCheckIcon className="h-6 w-6 text-emerald-600" />
                    ) : (
                      <ShieldExclamationIcon className="h-6 w-6 text-red-700" />
                    )}
                    <button
                      type="submit"
                      className="p-1 focus:outline-none focus:shadow-outline"
                      onClick={onCheckToken}
                    >
                      Check token
                    </button>
                  </span>
                </div>
                {(errors.accessToken || !isValidToken) && (
                  <span className="text-red-500 text-xs italic">
                    Invalid API key. Please make sure your API key is still working properly
                  </span>
                )}
              </div>
              <div className="mb-2">
                <label className="block text-sm font-bold mb-2" htmlFor="repository">
                  Github Repository
                </label>
                <input
                  className="border rounded w-full py-2 px-3  mb-3"
                  id="repository"
                  type="text"
                  placeholder="Github Repository"
                  {...register('repository', { required: true })}
                />
                {errors.repository && (
                  <span className="text-red-500 text-xs italic">This field is required</span>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="saveAs">
                  Save As
                </label>
                <input
                  className="border rounded w-full py-2 px-3 mb-3"
                  id="saveAs"
                  type="text"
                  placeholder="Save As ..."
                  {...register('saveAs', { required: true })}
                />
                {errors.saveAs && (
                  <span className="text-red-500 text-xs italic">This field is required</span>
                )}
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end p-6 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </button>
                {!isSaving ? (
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="submit"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold leading-6 bg-emerald-500 text-white transition duration-150 ease-in-out border-2 rounded shadow outline-none cursor-not-allowed"
                    disabled
                  >
                    <svg
                      className="w-5 h-5 mr-3 -ml-1 file:bg-emerald-500 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}
export default GithubFormModal
