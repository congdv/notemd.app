import { GithubService } from '@/service/GithubService'
import { useEffect, useState, Fragment } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Dialog, Transition } from '@headlessui/react'
import { ShieldCheckIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid'
import Button from './Button'

const GithubFormModal = ({
  setIsOpen,
  onSaveData,
  isOpen,
  closeModal,
}: {
  setIsOpen: (isOpen: boolean) => void
  onSaveData: (data: GithubFormData) => void
  isOpen: boolean
  closeModal: (data: GithubFormData) => void
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<GithubFormData>()
  const [isSaving, setSaving] = useState(false)
  const [isValidToken, setValidToken] = useState(true)

  const onSubmit = async (data: GithubFormData) => {
    if (data) {
      setSaving(true)
      await onSaveData(data)
      setSaving(false)
    }
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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => closeModal(getValues())}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-1/3 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Save file to Github
                </Dialog.Title>
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
                        {...register('accessToken', {
                          required: true,
                          validate: () => isValidToken,
                        })}
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
                  <div className="flex items-center justify-end p-6 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setIsOpen(false)}
                    >
                      Close
                    </button>
                    <Button type="submit" isWorking={isSaving}>
                      Save
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
export default GithubFormModal
