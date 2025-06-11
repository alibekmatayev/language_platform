import { Link, Outlet } from "react-router-dom";

function AdminPage() {
  return (
    <div className="admin-page">
      <div className="admin-nav">
        <div>
          <Link to="/admin/lessons">
            <button className="button-check">Уроки</button>
          </Link>
          <Link to="/admin/modules">
            <button className="button-check">Модули</button>
          </Link>
          <Link to="/admin/users">
            <button className="button-check">Пользователи</button>
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default AdminPage;
