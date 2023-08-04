import { Model, DataTypes} from "sequelize";

import db from './model_init';
import bcrypt from 'bcrypt'

const sequelize = db.sequelize;

class CodeSnippet extends Model {
  public id!: number;
  public language!: string;
  public code!: string;
}

CodeSnippet.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    language: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    code: {
      type: new DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "snippets",
    sequelize,
  }
);

export default CodeSnippet;
