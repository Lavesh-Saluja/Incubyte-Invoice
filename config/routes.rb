Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    namespace :health do
      get :live
      get :ready
    end

    resource :session, only: %i[show create destroy]
    resources :employees, only: %i[index show create update] do
      resource :notice_period, only: %i[create destroy], module: :employees
    end
    resource :settings, only: :show
    resources :countries, only: :index
  end
end
