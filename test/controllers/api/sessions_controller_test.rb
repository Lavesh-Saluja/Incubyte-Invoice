require "test_helper"

class Api::SessionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    Api::SessionsController::RATE_LIMIT_STORE.clear
    @user = create(:user, name: "HR Manager", email: "hr@acme.test", password: "correct-horse-battery")
  end

  def log_in(email: "hr@acme.test", password: "correct-horse-battery", headers: {})
    post "/api/session", params: { session: { email:, password: } }, headers:, as: :json
  end

  test "signs in with valid credentials and returns only public user fields" do
    log_in

    assert_response :ok
    assert_equal({ "user" => { "id" => @user.id, "name" => "HR Manager", "email" => "hr@acme.test", "role" => "hr" } },
      json_response)
  end

  test "sets an HttpOnly, SameSite=Lax session cookie without an expiry" do
    log_in

    cookie = response.headers["Set-Cookie"]
    assert_match(/\A_acme_session=/, cookie)
    assert_match(/httponly/i, cookie)
    assert_match(/samesite=lax/i, cookie)
    assert_no_match(/expires=|max-age=/i, cookie)
  end

  test "matches the email regardless of case and surrounding spaces" do
    log_in(email: "  HR@ACME.TEST ")

    assert_response :ok
  end

  test "rejects a wrong password and an unknown email with the same response" do
    log_in(password: "wrong-password-123")
    wrong_password = [ response.status, json_response ]

    log_in(email: "nobody@acme.test")

    assert_equal [ 401, { "error" => "Invalid email or password" } ], wrong_password
    assert_equal wrong_password, [ response.status, json_response ]
    get "/api/session"
    assert_response :unauthorized
  end

  test "rejects blank credentials" do
    log_in(email: "", password: "")

    assert_response :unauthorized
  end

  test "responds 400 to a malformed JSON body" do
    post "/api/session", params: "{not json", headers: { "Content-Type" => "application/json" }

    assert_response :bad_request
  end

  test "returns the signed-in user" do
    log_in
    get "/api/session"

    assert_response :ok
    assert_equal "hr@acme.test", json_response.dig("user", "email")
  end

  test "requires sign-in to read the session" do
    get "/api/session"

    assert_response :unauthorized
    assert_equal "Please sign in to continue", json_response["error"]
  end

  test "signing out ends the session" do
    log_in
    delete "/api/session"

    assert_response :no_content
    get "/api/session"
    assert_response :unauthorized
  end

  test "signing out requires a session" do
    delete "/api/session"

    assert_response :unauthorized
  end

  test "sessions expire 12 hours after sign-in, even when used" do
    log_in

    travel 11.hours
    get "/api/session"
    assert_response :ok

    travel 1.hour + 1.second
    get "/api/session"
    assert_response :unauthorized
  end

  test "a session for a removed user is rejected" do
    log_in
    @user.destroy!

    get "/api/session"

    assert_response :unauthorized
  end

  test "limits sign-in attempts to five per minute" do
    5.times { log_in(password: "wrong-password-123") }
    log_in

    assert_response :too_many_requests
    assert_equal "Too many sign-in attempts. Please wait a minute and try again", json_response["error"]

    travel 61.seconds
    log_in
    assert_response :ok
  end

  test "refuses state-changing requests sent from another site" do
    log_in(headers: { "Sec-Fetch-Site" => "cross-site" })
    assert_response :forbidden

    log_in(headers: { "Sec-Fetch-Site" => "same-site" })
    assert_response :forbidden

    log_in(headers: { "Sec-Fetch-Site" => "same-origin" })
    assert_response :ok
  end

  test "refuses request bodies that are not JSON" do
    post "/api/session", params: { session: { email: "hr@acme.test", password: "correct-horse-battery" } }

    assert_response :unsupported_media_type
  end

  test "API responses are never cached, including rejections" do
    get "/api/session"
    assert_equal "no-store", response.headers["Cache-Control"]

    log_in
    assert_equal "no-store", response.headers["Cache-Control"]
  end
end
