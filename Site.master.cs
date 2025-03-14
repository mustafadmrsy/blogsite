using System;
using System.Web.UI;

public partial class Site : MasterPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            // Aktif menü öğesini belirle
            SetActiveMenuItem();

            // Kullanıcı giriş yapmış mı kontrol et
            CheckUserLogin();
        }
    }

    private void SetActiveMenuItem()
    {
        // Aktif sayfaya göre menü öğesini işaretle
        string currentPage = System.IO.Path.GetFileName(Request.Url.AbsolutePath).ToLower();

        menuHome.Attributes.Remove("class");
        menuHome.Attributes.Add("class", "snk-sidebar-item");

        menuCategories.Attributes.Remove("class");
        menuCategories.Attributes.Add("class", "snk-sidebar-item");

        menuAbout.Attributes.Remove("class");
        menuAbout.Attributes.Add("class", "snk-sidebar-item");

        menuContact.Attributes.Remove("class");
        menuContact.Attributes.Add("class", "snk-sidebar-item");

        switch (currentPage)
        {
            case "default.aspx":
                menuHome.Attributes.Remove("class");
                menuHome.Attributes.Add("class", "snk-sidebar-item active");
                break;
            case "kategoriler.aspx":
                menuCategories.Attributes.Remove("class");
                menuCategories.Attributes.Add("class", "snk-sidebar-item active");
                break;
            case "hakkimizda.aspx":
                menuAbout.Attributes.Remove("class");
                menuAbout.Attributes.Add("class", "snk-sidebar-item active");
                break;
            case "iletisim.aspx":
                menuContact.Attributes.Remove("class");
                menuContact.Attributes.Add("class", "snk-sidebar-item active");
                break;
        }
    }

    private void CheckUserLogin()
    {
        // Kullanıcı giriş yapmış mı kontrol et
        // Session kullanarak oturum kontrolü
        if (Session["UserID"] != null)
        {
            // Kullanıcı giriş yapmış
            btnLogin.Visible = false;
            btnRegister.Visible = false;
            btnCreate.Visible = true;

            litUserName.Text = Session["UserName"]?.ToString() ?? "Kullanıcı";
            litUserHandle.Text = "@" + (Session["UserHandle"]?.ToString() ?? "kullanici");
        }
        else
        {
            // Kullanıcı giriş yapmamış
            btnLogin.Visible = true;
            btnRegister.Visible = true;
            btnCreate.Visible = false;
        }
    }

    protected void btnLogin_Click(object sender, EventArgs e)
    {
        // Giriş yapma sayfasına yönlendir
        Response.Redirect("~/Login.aspx");
    }

    protected void btnRegister_Click(object sender, EventArgs e)
    {
        // Kayıt olma sayfasına yönlendir
        Response.Redirect("~/Register.aspx");
    }

    protected void btnCreate_Click(object sender, EventArgs e)
    {
        // Blog yazısı oluşturma sayfasına yönlendir
        Response.Redirect("~/CreateBlog.aspx");
    }

    protected void btnLogout_Click(object sender, EventArgs e)
    {
        // Oturumu sonlandır
        Session.Clear();
        Session.Abandon();
        Response.Redirect("~/Default.aspx");
    }
}
