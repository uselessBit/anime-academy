from sqladmin import ModelView
from src.clients.database.models.user import User

class UserAdmin(ModelView, model=User):
    column_list = [User.id, User.email, User.username]
    name_plural = "Users"
