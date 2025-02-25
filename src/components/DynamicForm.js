import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./DynamicForm.css";

const schema = yup.object().shape({
  fields: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Бұл өріс міндетті"),
      type: yup.string().oneOf(["text", "number", "email"]).required(),
      value: yup.string().required("Мәнді енгізіңіз"),
    })
  ),
});

export default function DynamicForm() {
  const savedData = JSON.parse(localStorage.getItem("formData")) || {
    fields: [{ name: "", type: "text", value: "" }],
  };

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: savedData,
    resolver: yupResolver(schema),
  });

  const fields = watch("fields");

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify({ fields }));
  }, [fields]);

  const addField = () => {
    setValue("fields", [...fields, { name: "", type: "text", value: "" }]);
  };

  const removeField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setValue("fields", updatedFields);
  };

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    alert("Форма жіберілді!");
    localStorage.setItem("formData", JSON.stringify(data));
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Динамикалық форма</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div key={index} className="form-group">
            <Controller
              name={`fields.${index}.name`}
              control={control}
              render={({ field }) => (
                <input {...field} placeholder="Атау" className="input-field" />
              )}
            />
            <Controller
              name={`fields.${index}.type`}
              control={control}
              render={({ field }) => (
                <select {...field} className="select-field">
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="email">Email</option>
                </select>
              )}
            />
            <Controller
              name={`fields.${index}.value`}
              control={control}
              render={({ field }) => (
                <input {...field} placeholder="Мән" className="input-field" />
              )}
            />
            <button type="button" className="remove-btn" onClick={() => removeField(index)}>
              ❌
            </button>
          </div>
        ))}
        <button type="button" onClick={addField} className="add-btn">
          + Өріс қосу
        </button>
        <button type="submit" className="submit-btn">
          Жіберу
        </button>
      </form>
    </div>
  );
}