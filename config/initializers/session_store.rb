if Rails.env === 'production'
  Rails.application.config.session_store :cookie_store, key: '_bvwtgt', domain: 'bvwtgt-api'
else
  Rails.application.config.session_store :cookie_store, key: '_bvwtgt'
end
